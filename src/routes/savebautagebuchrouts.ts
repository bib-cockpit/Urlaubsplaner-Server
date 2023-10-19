import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IProtokollstruktur} from "../datenstrukturen/protokollstruktur_server";
import {ProtokollDBClass} from "../database/protokolledbclass";
import {ConfidentialClientApplication} from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import {ConfigClass} from "../configclass";
import * as playwright from 'playwright';
import * as fs from 'fs';
import {IStandortestruktur} from "../datenstrukturen/standortestruktur_server";
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import * as Buffer from "buffer";
import moment, {Moment} from "moment";
import {IProjektestruktur} from "../datenstrukturen/projektestruktur_server";
import {IBautagebuchstruktur} from "../datenstrukturen/bautagebuchstruktur_server";
import {Toolsclass} from "../toolsclass";
import {Constclass} from "../constclass";

export class SaveBautagebuchroutsClass {

  public  savebautagebuchrouter: any;
  private Debug: DebugClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;
  private Tools: Toolsclass;
  private Const: Constclass;
  private Testvar: any;

  constructor() {

    this.Debug                 = new DebugClass();
    this.savebautagebuchrouter = Router();
    this.Authentication        = new AuthenticationClass();
    this.Tools                 = new Toolsclass();
    this.Const                 = new Constclass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SaveBautagebuchroutsClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public SetRoutes() {

    try {

      let token;
      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.CLIENT_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.CLIENT_APPLICATION_SECRET;
      let putdata: any;


      this.savebautagebuchrouter.put('/', async (req: Request, res: Response) => {

        console.log('Save Bautagebuch');

        const data: any   = req.body;
        const DirectoryID: string = data.DirectoryID;
        const Filename: string    = data.Filename;
        const Bautagebuch: IBautagebuchstruktur = data.Bautagebuch;
        const Standort: IStandortestruktur = data.Standort;
        const Mitarbeiter: IMitarbeiterstruktur = data.Mitarbeiter;
        const Projekt: IProjektestruktur = data.Projekt;
        const ShowMailinformations: boolean = data.ShowMailinformations;

        const imageblob   = await this.ReadLogo();
        const browser     = await playwright.chromium.launch();
        const page        = await browser.newPage();

        let html = '';
        let Nummer: number;
        let Header: string;
        let Footer: string;
        let SendeZeitpunkt: Moment;
        let Zeitpunkt: Moment = moment(Bautagebuch.Zeitstempel).locale('de');
        let KW: string = Zeitpunkt.isoWeeks().toString();

        Header = '<div id="header-template" style="-webkit-print-color-adjust: exact; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"></div>';
        Footer = '<div id="header-template" style="-webkit-print-color-adjust: exact; display: flex; align-items: center; justify-content: center; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>';

        html += '<!DOCTYPE html>';
        html += '<html>';
        html += '<head>';
        html += '<title>` + Bautagebuch.Titel + `</title>';

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
        html += '<td style="width: 50%" valign="top">';

        // Bautagebuch Infos

        html += '<table class="docinnertable">';
        html += '<tr><td style="font-weight: bold">Projekt</td><td>' + Projekt.Projektname + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Projektnummer</td><td>' + Projekt.Projektnummer + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Datum</td><td>' + Bautagebuch.Zeitstring + '</td></tr>';
        html += '<tr><td style="font-weight: bold">KW</td><td>' + KW + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Bautagebuchnummer</td><td>' + Bautagebuch.Nummer + '</td></tr>';
        html += '</table>';



        html += '</td>';
        html += '<td style="width: 50%" align="right" valign="top">';

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

        html += '<br>';

        html += '<table>';
        html += '<tr><td><h2>Bautagebuch ' + Bautagebuch.Nummer + '</h2></td>';
        html += '</table>';

        html += '<br>';

        // Witterung

        let Liste: string[] = [];
        if(Bautagebuch.Regen)    Liste.push('Regen');
        if(Bautagebuch.Frost)    Liste.push('Frost');
        if(Bautagebuch.Schnee)   Liste.push('Schnee');
        if(Bautagebuch.Wind)     Liste.push('Wind');
        if(Bautagebuch.Sonnig)   Liste.push('Sonnig');
        if(Bautagebuch.Bewoelkt) Liste.push('Bewölkt');
        if(Bautagebuch.Bedeckt)  Liste.push('Bedeckt');

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 50%">Temperatur</td>';
        html += '<td style="font-weight: bold; width: 50%">Witterung</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>';
        html += Bautagebuch.Temperatur + ' &deg;C';
        html += '</td>';
        html += '<td>';

        for(let i = 0; i < Liste.length; i++) {

          html += Liste[i];
          if(i < Liste.length - 1) html += ', ';
        }

        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<br><br>';

        // Arbeitskräfte

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 100%" colspan="4">Arbeitskräftebesatz</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="width: 25%">Vorarbeiter</td>';
        html += '<td style="width: 25%">Facharbeiter</td>';
        html += '<td style="width: 25%">Helfer</td>';
        html += '<td style="width: 25%">Lehrling</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>' + Bautagebuch.Vorarbeiter  + '</td>';
        html += '<td>' + Bautagebuch.Facharbeiter + '</td>';
        html += '<td>' + Bautagebuch.Helfer       + '</td>';
        html += '<td>' + Bautagebuch.Lehrling     + '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<br><br>';

        // Bautagebuch Eintraege

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td style="font-weight: bold;" colspan="3">Tätigkeit</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 30px">Nr.</td>';
        html += '<td style="font-weight: bold; width: auto">Beschreibung</td>';
        html += '<td style="font-weight: bold; width: 70px;">Stunden</td>';
        html += '</tr>';

        Nummer  = 1;

        for(let Eintrag of Bautagebuch.Eintraegeliste) {

          html += '<tr valign="top">';
          html += '<td style="width: 30px">'  + Nummer.toString()  + '</td>';
          html += '<td style="width: auto">' + Eintrag.Taetigkeit  + '</td>';
          html += '<td style="width: 70px">' + Eintrag.Arbeitszeit + '</td>';
          html += '</tr>';

          Nummer++;
        }

        html += '</table>';

        html += '<br><br>';

        // Behinderungen

        let Behinderung  = Bautagebuch.Behinderungen !== '' ? this.Tools.FormatLinebreaks(Bautagebuch.Behinderungen) : 'keine';
        let Vorkommnisse = Bautagebuch.Vorkommnisse  !== '' ? this.Tools.FormatLinebreaks(Bautagebuch.Vorkommnisse)  : 'keine';

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 50%">Behinderungen</td>';
        html += '<td style="font-weight: bold; width: 50%">Vorkommnisse / Anordnungen / Hinweise</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="min-height: 40px">' + Behinderung  + '</td>';
        html += '<td style="min-height: 40px">' + Vorkommnisse + '</td>';
        html += '</tr>';
        html += '</table>';

        // Versandinformationen

        if(ShowMailinformations === true) {

          SendeZeitpunkt = moment();
          Bautagebuch.GesendetZeitstempel = SendeZeitpunkt.valueOf();
          Bautagebuch.GesendetZeitstring  = SendeZeitpunkt.format('DD.MM.YYYY HH:mm');

          html += '<br><br><br>';

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 50%">Empfänger</td>';
          html += '<td style="font-weight: bold; width: 50%">Kopienempfänger</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < Bautagebuch.Empfaengerliste.length; i++) {

            html += Bautagebuch.Empfaengerliste[i].Email;
            if (i < Bautagebuch.Empfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < Bautagebuch.CcEmpfaengerliste.length; i++) {

            html += Bautagebuch.CcEmpfaengerliste[i].Email;
            if (i < Bautagebuch.CcEmpfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '</tr>';
          html += '<tr><td colspan="2">Gesendet: ' + Bautagebuch.GesendetZeitstring + '</td></tr>';
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

        // let Url = '/groups/' + TeamsID + '/drive/items/' + DirectoryID + ':/' + Filename + ':/content';
        let Url = '/sites/' + this.Const.BAESiteID + '/drive/items/' + DirectoryID + ':/' + Filename + ':/content';


        try {

          putdata = await graphClient.api(Url).put(pdf);

          console.log('Bautagebuch ' + Filename + ' wurde erstellt.');

          putdata.GesendetZeitstempel = Bautagebuch.GesendetZeitstempel;
          putdata.GesendetZeitstring  = Bautagebuch.GesendetZeitstring;

          res.status(200).send(putdata);
        }
        catch(error: any) {

          debugger;

          console.error('Bautagebuch ' + Filename + ' erstellen fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveBautagebuchroutsClass', 'SetRoutes');
    }
  }

  private async ReadLogo(): Promise<any> {

    return new Promise((resolve, reject) => {

      fs.readFile('images/bae_logo.png', (error, buffer: Buffer) => {

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


