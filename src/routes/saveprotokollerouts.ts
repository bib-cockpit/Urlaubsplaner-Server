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
import moment, {Moment} from "moment";
import {IProjektestruktur} from "../datenstrukturen/projektestruktur_server";
import {Constclass} from "../constclass";
import {Thumbnailstruktur} from "../datenstrukturen/thumbnailstrucktur_server";

export class SaveProtokolleroutsClass {

  public  saveprotokolllerouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;
  private Const: Constclass;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.saveprotokolllerouter = Router();
    this.Authentication         = new AuthenticationClass();
    this.Const                  = new Constclass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SaveProtokolleroutsClass', 'Init', this.Debug.Typen.Class);
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


      this.saveprotokolllerouter.put('/', async (req: Request, res: Response) => {

        console.log('Save Protokoll');

        const data: any   = req.body;
        const DirectoryID: string = data.DirectoryID;
        const Filename: string    = data.Filename;
        const Protokoll: IProtokollstruktur = data.Protokoll;
        const Standort: IStandortestruktur = data.Standort;
        const Mitarbeiter: IMitarbeiterstruktur = data.Mitarbeiter;
        const Projekt: IProjektestruktur = data.Projekt;
        const ShowMailinformations: boolean = data.ShowMailinformations;
        let Thumbnailiste: Thumbnailstruktur[][];
        let Thumb: Thumbnailstruktur;
        const logoimageblob = await this.ReadLogo();
        const browser       = await puppeteer.launch();
        const page          = await browser.newPage();

        let html = '';
        let Nummer: number;
        let Header: string;
        let Footer: string;
        let Punkteindex: number;
        let SendeZeitpunkt: Moment;
        let Index: number;
        let Content: Blob;


        Header = '<div id="header-template" style="-webkit-print-color-adjust: exact; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"></div>';
        Footer = '<div id="header-template" style="-webkit-print-color-adjust: exact; display: flex; align-items: center; justify-content: center; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>';

        html += '<!DOCTYPE html>';
        html += '<html>';
        html += '<head>';
        html += '<title>` + Protokoll.Titel + `</title>';

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
        html += '<td colspan="2" align="right"><img src="data:image/png;base64,' + logoimageblob + '" style="width: 198px; height: 68px"/></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="width: 50%">';

        // Protokoll Infos

        html += '<table class="docinnertable">';
        html += '<tr><td style="font-weight: bold">Thema</td><td>' + Protokoll.Titel + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Besprechungsort</td><td>' + Protokoll.Besprechungsort + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Datum</td><td>' + Protokoll.Zeitstring + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Projektnummer</td><td>' + Projekt.Projektnummer + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Protokollnummer</td><td>' + Protokoll.Protokollnummer + '</td></tr>';
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

        // Teilnehmer

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td rowspan="2" style="width: 90px"><b>Teilnehmer</b></td>';
        html += '<td>';

        for(let i = 0; i < Protokoll.ExterneTeilnehmerliste.length; i++) {

          html += Protokoll.ExterneTeilnehmerliste[i];
          if(i < Protokoll.ExterneTeilnehmerliste.length - 1) html += ', ';
        }

        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>';

        for(let i = 0; i < Protokoll.InterneTeilnehmerliste.length; i++) {

          html += Protokoll.InterneTeilnehmerliste[i];
          if(i < Protokoll.InterneTeilnehmerliste.length - 1) html += ', ';
        }

        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<br><br>';

        // Prtokollpunkte

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 30px">Nr.</td>';
        html += '<td style="font-weight: bold; width: auto">Beschreibung</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Termin</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Status</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Zuständig</td>';
        html += '</tr>';

        Punkteindex    = 0;
        Nummer         = 1;
        Index          = 0;
        Thumbnailiste  = [];

        for(let Eintrag of Protokoll.Projektpunkteliste) {

          Thumbnailiste[Index] = [];

          if(Eintrag.ProtokollShowBilder) {

            for(let Bild of Eintrag.Bilderliste) {

              Thumb = await this.ReadThumbnailinfo(Bild.FileID, Bild.WebUrl);

              if(Thumb !== null) Thumbnailiste[Index].push(Thumb);
            }
          }

          Index++
        }

        for(let Zeile of Thumbnailiste) {

          for(let Thumbeintrag of Zeile) {

            Content              = await this.ReadThumbnailcontent(Thumbeintrag);
            let Imagebuffuer     = await Content.arrayBuffer(); // URL.createObjectURL(Content);
            let Image            = Buffer.from(Imagebuffuer).toString('base64');
            Thumbeintrag.Content = Image;
          }
        }

        Index = 0;

        for(let Eintrag of Protokoll.Projektpunkteliste) {

          html += '<tr valign="top">';
          html += '<td style="width: 30px">'  + Nummer.toString() + '</td>';
          html += '<td style="width: 400px">';

          html += '<table class="nobordersmalltable">';

          if(Protokoll.Kostengruppenliste[Punkteindex] !== 'none') {

            html += '<tr>';
            html += '<td style="color: #FF9333 !important; font-weight: bold;">' + Protokoll.Kostengruppenliste[Punkteindex] + '</td>';
            html += '</tr>';
          }

          html += '<tr>';
          html += '<td>'  + Eintrag.Aufgabe + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td>';

            html += '<table>';
            html += '<tr>';

            for(let thumb of Thumbnailiste[Index]) {

              html += '<td style="padding: 2px">';
              // html += '<a href="' + thumb.weburl + '">';
              html += '<img src="data:image/png;base64,' + thumb.Content + '" style="width: 96px">';
              // html += '</a>';
              html += '</td>';
            }

            html += '</tr>';
            html += '</table>'

          html += '</td>';
          html += '</tr>';
          html += '</table>'

          html += '</td>';

          html += '<td style="width:  70px; text-align: center;">';

          if(Eintrag.Status !== 'Festlegung' && Eintrag.Status !== 'Protokollpunkt') {

            html += Eintrag.Endezeitstring;
          }

          html += '</td>';
          html += '<td style="width: 100px; text-align: center; color: white !important; background: ' + this.GetStatuscolor(Eintrag.Status) + ' !important;">'  + this.GetStatustext(Eintrag.Status) + '</td>';
          html += '<td style="width:  70px; text-align: center;">';

          // Prtokollpunkte Zuständigkeiten

          html += '<table class="nobordersmalltable" style="width: 100%">';

          for(let Intern of Protokoll.InternZustaendigListe[Punkteindex]) {

            html += '<tr><td style="text-align: center; font-size: 90%">' + Intern + '</td></tr>';
          }

          if(Protokoll.ExternZustaendigListe[Punkteindex].length > 0) {

            html += '<tr><td style="text-align: center; font-size: 110%; font-weight: bold">&bull;</td></tr>';
          }

          for(let Extern of Protokoll.ExternZustaendigListe[Punkteindex]) {

            html += '<tr><td style="text-align: center; font-size: 90%">' + Extern + '</td></tr>';
          }

          html += '</table>';

          html += '</td>';
          html += '</tr>';

          Punkteindex++;
          Nummer++;
          Index++;
        }

        html += '</table>';

        if(ShowMailinformations === true) {

          SendeZeitpunkt = moment();
          Protokoll.GesendetZeitstempel = SendeZeitpunkt.valueOf();
          Protokoll.GesendetZeitstring  = SendeZeitpunkt.format('DD.MM.YYYY HH:mm');

          html += '<br><br><br>';

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 50%">Empfänger</td>';
          html += '<td style="font-weight: bold; width: 50%">Kopienempfänger</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < Protokoll.Empfaengerliste.length; i++) {

            html += Protokoll.Empfaengerliste[i].Email;
            if (i < Protokoll.Empfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < Protokoll.CcEmpfaengerliste.length; i++) {

            html += Protokoll.CcEmpfaengerliste[i].Email;
            if (i < Protokoll.CcEmpfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '</tr>';
          html += '<tr><td colspan="2">Gesendet: ' + Protokoll.GesendetZeitstring + '</td></tr>';
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

          console.log('Protokoll ' + Filename + ' wurde erstellt.');

          putdata.GesendetZeitstempel = Protokoll.GesendetZeitstempel;
          putdata.GesendetZeitstring  = Protokoll.GesendetZeitstring;

          res.status(200).send(putdata);
        }
        catch(error: any) {

          debugger;

          console.error('Protokoll ' + Filename + ' erstellen fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveProtokolleroutsClass', 'SetRoutes');
    }
  }

  private async ReadThumbnailinfo(fileid: string, weburl: string): Promise<Thumbnailstruktur> {

    try {

      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.CLIENT_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.CLIENT_APPLICATION_SECRET;
      let getdata: any;
      let chunk: any;
      let filebuffer = [];
      let filedata;
      let graphClient;
      let msalClient;
      let tokenRequest;
      let token;

      const msalConfig = {
        auth: {
          clientId:     clientId,
          authority:    endpoint + '/' + tenantId,
          clientSecret: Secret,
        }
      };

      msalClient = new ConfidentialClientApplication(msalConfig);

      tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
      };

      token = await msalClient.acquireTokenByClientCredential(tokenRequest);

      graphClient = Client.init({

        authProvider: done => {

          done(null, token.accessToken);
        }
      });

      let Url = '/sites/' + this.Const.BAESiteID + '/drive/items/' + fileid + '/thumbnails';

      try {

        getdata = await graphClient.api(Url).get();
      }
      catch(error: any) {

        console.error('Bild konnte nicht geladen werden: ' + error.message);

        return Promise.resolve(null);
      }

      if(getdata) {

        return {

          Content:   '',
          id:        getdata.value[0].id,
          fileid:    fileid,
          filename:  '',
          weburl:    weburl,
          mediumurl: getdata.value[0].medium.url,
          largeurl:  getdata.value[0].large.url,
          smallurl:  getdata.value[0].small.url,
          height: {

            small:  getdata.value[0].small.height,
            medium: getdata.value[0].medium.height,
            large:  getdata.value[0].medium.large,
          },
          width: {

            small:  getdata.value[0].small.width,
            medium: getdata.value[0].medium.width,
            large:  getdata.value[0].large.width,
          }
        };
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveProtokolleroutsClass', 'ReadThumbnailinfo');
    }
  }

  private async ReadThumbnailcontent(thumb: Thumbnailstruktur): Promise<any> {

    try {

      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.CLIENT_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.CLIENT_APPLICATION_SECRET;
      let getdata: Blob;
      let chunk: any;
      let filebuffer = [];
      let filedata;
      let graphClient;
      let msalClient;
      let tokenRequest;
      let token;

      const msalConfig = {
        auth: {
          clientId:     clientId,
          authority:    endpoint + '/' + tenantId,
          clientSecret: Secret,
        }
      };

      msalClient = new ConfidentialClientApplication(msalConfig);

      tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
      };

      token = await msalClient.acquireTokenByClientCredential(tokenRequest);

      graphClient = Client.init({

        authProvider: done => {

          done(null, token.accessToken);
        }
      });

      let Url = '/sites/' + this.Const.BAESiteID + '/drive/items/' + thumb.fileid + '/thumbnails/0/small/content';

      try {

        getdata = await graphClient.api(Url).get();
      }
      catch(error: any) {

        console.error('Bild konnte nicht geladen werden: ' + error.message);

        return null;
      }

      if(getdata) {

        return Promise.resolve(getdata);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveProtokolleroutsClass', 'ReadThumbnailcontent');
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

  private GetStatustext(status): string {

    switch (status) {

      case 'Protokollpunkt':

        return 'Info';

        break;

      case 'Ruecklauf':

        return 'Rücklauf';

        break;

      default:

        return status;

        break;
    }
  }

  private GetStatuscolor(status): string {

    switch (status) {

      case 'Offen':

        return '#008080';

        break;

      case 'Protokollpunkt':

        return '#34495E';

        break;

      case 'Geschlossen':

        return '#008000';

        break;

      case 'Ruecklauf':

        return '#0020C2';

        break;

      case 'Festlegung':

        return '#FF9333';

        break;
    }
  }
}


