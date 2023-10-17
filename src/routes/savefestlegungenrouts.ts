import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IProtokollstruktur} from "../datenstrukturen/protokollstruktur_server";
import {ProtokollDBClass} from "../database/protokolledbclass";
import {ConfidentialClientApplication} from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import {ConfigClass} from "../configclass";
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import {IStandortestruktur} from "../datenstrukturen/standortestruktur_server";
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import * as Buffer from "buffer";
import moment, {Moment} from "moment";
import {IProjektestruktur} from "../datenstrukturen/projektestruktur_server";
import {IProjektpunktestruktur} from "../datenstrukturen/projektpunktestruktur_server";
import {IKostengruppenstruktur} from "../datenstrukturen/kostengruppenstruktur_server";

export class SaveFestlegungenroutsClass {

  public  savefestlegungenrouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;
  private Testvar: any;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.savefestlegungenrouter = Router();
    this.Authentication         = new AuthenticationClass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SaveFestlegungenroutsClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public SetRoutes() {

    try {

      let token;
      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.SERVER_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.SERVER_APPLICATION_SECRET;
      let putdata: any;
      let Gruppe: IProjektpunktestruktur;
      let Punkt: IProjektpunktestruktur;
      let Ursprung: string;
      let GesendetZeitstempel: number;
      let GesendetZeitstring: string;


      this.savefestlegungenrouter.put('/', async (req: Request, res: Response) => {

        console.log('Save Festlegungen');

        const data: any   = req.body;
        const TeamsID: string     = data.TeamsID;
        const DirectoryID: string = data.DirectoryID;
        const Filename: string    = data.Filename;
        const Standort: IStandortestruktur = data.Standort;
        const Mitarbeiter: IMitarbeiterstruktur = data.Mitarbeiter;
        const Projekt: IProjektestruktur = data.Projekt;
        const ShowMailinformations: boolean = data.ShowMailinformations;
        const Displayliste: IProjektpunktestruktur[][] = data.Displayliste;
        const Kostengruppenliste: IProjektpunktestruktur[] = data.Kostengruppenliste;
        const Datum: string = moment().format('DD.MM.YYYY');
        const CcEmpfaengerliste: {
          Name:  string;
          Email: string;
        }[] = data.CcEmpfaengerliste;
        const Empfaengerliste: {
          Name:  string;
          Email: string;
        }[] = data.Empfaengerliste;

        const imageblob   = await this.ReadLogo();
        const browser     = await puppeteer.launch();
        const page        = await browser.newPage();

        let html = '';
        let Nummer: number;
        let Header: string;
        let Footer: string;
        let Punkteindex: number;
        let SendeZeitpunkt: Moment;

        Header = '<div id="header-template" style="-webkit-print-color-adjust: exact; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"></div>';
        Footer = '<div id="header-template" style="-webkit-print-color-adjust: exact; display: flex; align-items: center; justify-content: center; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>';

        html += '<!DOCTYPE html>';
        html += '<html>';
        html += '<head>';
        html += '<title>Festlegungen' + Projekt.Projektname + '</title>';

        html += '<style>';
        html += 'body { font-family: tahoma; font-size: 14px; }';
        html += '.docinnertable { border:  1px solid #000000; border-collapse: collapse; }';
        html += '.docinnertable td { padding: 4px; border:  1px solid black; }';
        html += '.nobordersmalltable { border-collapse: collapse; }';
        html += '.nobordersmalltable td { padding: 0px; border: none; }';
        html += '</style>';

        html += '</head>';
        html += '<body>';

        html += '<table style="width: 100%; border-collapse: collapse;">';
        html += '<tr>';
        html += '<td colspan="2" align="right"><img src="data:image/png;base64,' + imageblob + '" style="width: 198px; height: 68px"/></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="width: 50%">';

        // Projekt Infos

        html += '<table class="docinnertable">';
        html += '<tr><td style="font-weight: bold; font-size: 120%" colspan="2">Festlegungsliste</td></tr>';
        html += '<tr><td style="font-weight: bold">Porjekt</td><td>' + Projekt.Projektname + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Porjektnummer</td><td>' + Projekt.Projektnummer + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Stand</td><td>' + Datum + '</td></tr>';
        html += '</table>';

        html += '</td>';
        html += '<td style="width: 50%" align="right">';

        let Standortname = Standort !== null ? Standort.Standort : '';

        // Standort Infos

        html += '<table class="docinnertable">';
        html += '<tr><td style="font-weight: bold">Standort</td><td>' + Standortname + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Ersteller</td><td>' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Email</td><td>' + Mitarbeiter.Email + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Telefon</td><td>' + Mitarbeiter.Telefon + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Mobil</td><td>' + Mitarbeiter.Mobil + '</td></tr>';
        html += '</table>';

        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<br><br>';

        // Prtokollpunkte

        html += '<table  style="width: 100%">';

        for(let i = 0; i < Kostengruppenliste.length; i++) {

          Gruppe = Kostengruppenliste[i];

          html += '<tr>';
          html += '<td style="font-weight: bold; font-size: 120%">';
          html += Gruppe.Kostengruppenname;
          html += '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td>';

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 30px">Nr.</td>';
          html += '<td style="font-weight: bold; width: 70px">Datum</td>';
          html += '<td style="font-weight: bold; width: auto;">Beschreibung</td>';
          html += '<td style="font-weight: bold; width: 70px; text-align: center;">Phase</td>';
          html += '<td style="font-weight: bold; width: 70px; text-align: center;">Ursprung</td>';
          html += '</tr>';

          Punkteindex = 0;
          Nummer = 1;


          for (let j = 0; j < Displayliste[i].length; j++) {

            Punkt = Displayliste[i][j];
            Ursprung = Punkt.ProtokollID !== null ? 'P' : '';

            html += '<tr valign="top">';
            html += '<td style="width: 30px">' + (j + 1).toString() + '</td>';
            html += '<td style="width: 70px">' + Punkt.Startzeitstring + '</td>';
            html += '<td style="width: auto">';

              html += '<table class="nobordersmalltable">';
              html += '<tr>';

              if(Punkt.OpenFestlegung) {

                html += '<td style="padding: 4px;"><div style="width: 10px; height: 10px; background: red; border-radius: 50%"></div></td>';
              }

              html += '<td>' + Punkt.Aufgabe + '</td>';
              html += '</tr>';
              html += '</table>';

            html += '</td>';
            html += '<td style="width: 70px; text-align: center;">' + Punkt.Leistungsphase + '</td>';
            html += '<td style="width: 70px; text-align: center;">' + Ursprung + '</td>';
            html += '</tr>';
          }

          html += '</table>';

          html += '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="height: 8px"></td>';
          html += '</tr>';
        }

        html += '</table>';

        if(ShowMailinformations === true) {

          SendeZeitpunkt = moment();
          GesendetZeitstempel = SendeZeitpunkt.valueOf();
          GesendetZeitstring  = SendeZeitpunkt.format('DD.MM.YYYY HH:mm');

          html += '<br><br><br>';

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 50%">Empfänger</td>';
          html += '<td style="font-weight: bold; width: 50%">Kopienempfänger</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < Empfaengerliste.length; i++) {

            html += Empfaengerliste[i].Email;
            if (i < Empfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < CcEmpfaengerliste.length; i++) {

            html += CcEmpfaengerliste[i].Email;
            if (i < CcEmpfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '</tr>';
          html += '<tr><td colspan="2">Gesendet: ' + GesendetZeitstring + '</td></tr>';
          html += '</table>';

          html += '</body>';
          html += '</html>';
        }

        await page.setContent(html, { waitUntil: 'domcontentloaded' });

        const pdf = await page.pdf({
          margin: { top: '50px', right: '30px', bottom: '50px', left: '30px' },
          printBackground: true,
          format: 'A4',
          displayHeaderFooter: true,
          headerTemplate: Header,
          footerTemplate: Footer
        });

        const msalConfig = {
          auth: {
            clientId:     clientId,
            authority:    endpoint + '/' + tenantId,
            clientSecret: Secret,
          }
        };

        const msalClient = new ConfidentialClientApplication(msalConfig);

        const tokenRequest = {
          scopes: ['https://graph.microsoft.com/.default'],
        };

        token = await msalClient.acquireTokenByClientCredential(tokenRequest);

        const graphClient = Client.init({

          authProvider: done => {

            done(null, token.accessToken);
          }
        });

        let Url = '/groups/' + TeamsID + '/drive/items/' + DirectoryID + ':/' + Filename + ':/content';

        try {

          putdata = await graphClient.api(Url).put(pdf);

          console.log('Festlegungsliste ' + Filename + ' wurde erstellt.');

          /*
                    SendeZeitpunkt = moment();
          Protokoll.GesendetZeitstempel = SendeZeitpunkt.valueOf();
          Protokoll.GesendetZeitstring  = SendeZeitpunkt.format('DD.MM.YYYY HH:mm');
           */


          res.status(200).send(putdata);
        }
        catch(error: any) {

          debugger;

          console.error('Festlegungen ' + Filename + ' erstellen fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveFestlegungenroutsClass', 'SetRoutes');
    }
  }

  private async ReadLogo(): Promise<any> {

    return new Promise((resolve, reject) => {

      fs.readFile('images/bi_logo.png', (error, buffer: Buffer) => {

        if(error) {

          resolve(null);
        }
        else {

          resolve( buffer.toString('base64'));
        }
      });
    });
  }
}


