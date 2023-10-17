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
import moment, {Moment} from "moment";
import {IProjektestruktur} from "../datenstrukturen/projektestruktur_server";
import {Toolsclass} from "../toolsclass";
import {Constclass} from "../constclass";
import {ILOPListestruktur} from "../datenstrukturen/loplistestruktur_server";
import {IProjektpunktestruktur} from "../datenstrukturen/projektpunktestruktur_server";
import {Thumbnailstruktur} from "../datenstrukturen/thumbnailstrucktur_server";
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import Jimp from "jimp";

export class SaveLOPListeroutsClass {

  public  saveloplisterouter: any;
  private Debug: DebugClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;
  private Tools: Toolsclass;
  private Const: Constclass;
  private Testvar: any;

  constructor() {

    this.Debug                 = new DebugClass();
    this.saveloplisterouter    = Router();
    this.Authentication        = new AuthenticationClass();
    this.Tools                 = new Toolsclass();
    this.Const                 = new Constclass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SaveLOPListeroutsClass', 'Init', this.Debug.Typen.Class);
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


      this.saveloplisterouter.put('/', async (req: Request, res: Response) => {

        console.log('Save LOP Liste');

        const data: any   = req.body;
        const DirectoryID: string = data.DirectoryID;
        const Filename: string    = data.Filename;
        const LOPListe: ILOPListestruktur = data.LOPListe;
        const Standort: IStandortestruktur = data.Standort;
        const Mitarbeiter: IMitarbeiterstruktur = data.Mitarbeiter;
        const Projekt: IProjektestruktur = data.Projekt;
        const ShowMailinformations: boolean = data.ShowMailinformations;
        let Thumb: Thumbnailstruktur;
        let Zeilenanzahlliste: number[];
        let Anzahl: number;
        let Spaltenanzahl: number;
        let Thumbindex: number;
        let Thumbnail: Thumbnailstruktur;
        let Thumbnailliste: Thumbnailstruktur[][][];
        let BigThumbnailliste: Thumbnailstruktur[];
        let BigThumbnailnummern: string[];
        let Thumbnailbreite: number;
        let Thumbnailbreiteliste: number[];

        const imageblob   = await this.ReadLogo();
        const browser     = await puppeteer.launch();
        const page        = await browser.newPage();
        let html = '';
        let Content: Blob;
        let Punkteindex: number;
        let Nummer: number;
        let Header: string;
        let Footer: string;
        let SendeZeitpunkt: Moment;
        let Zeitpunkt: Moment = moment(LOPListe.Zeitstempel).locale('de');
        let KW: string = Zeitpunkt.isoWeeks().toString();

        // Bilder

        Punkteindex          = 0;
        Nummer               = 1;
        Thumbnailliste       = [];
        Zeilenanzahlliste    = [];
        Thumbnailbreiteliste = [];
        BigThumbnailnummern  = [];
        BigThumbnailliste    = [];

        for(let Eintrag of LOPListe.Projektpunkteliste) {

          Thumbnailliste[Punkteindex] = [];

          switch (Eintrag.Thumbnailsize) {

            case 'small':

              Spaltenanzahl   = 4;
              Thumbnailbreite = 100;

              break;
            case 'medium':

              Spaltenanzahl   = 2;
              Thumbnailbreite = 200;

              break;

            case 'large':

              Spaltenanzahl   = 1;
              Thumbnailbreite = 400;

              break;
          }

          Thumbnailbreiteliste[Punkteindex] = Thumbnailbreite;

          if(Eintrag.ProtokollShowBilder) {

            Anzahl                         = Eintrag.Bilderliste.length;
            Zeilenanzahlliste[Punkteindex] = Math.ceil(Anzahl / Spaltenanzahl);
            Thumbindex                     = 0;
            Thumbnailliste[Punkteindex]    = [];

            for(let Zeilenindex = 0; Zeilenindex < Zeilenanzahlliste[Punkteindex]; Zeilenindex++) {

              Thumbnailliste[Punkteindex][Zeilenindex] = [];

              for(let Spaltenindex = 0; Spaltenindex < Spaltenanzahl; Spaltenindex++) {

                if(Eintrag.Bilderliste[Thumbindex]) {

                  Thumbnail        = this.GetEmptyThumbnail();
                  Thumbnail.id     = Eintrag.Bilderliste[Thumbindex].FileID;
                  Thumbnail.weburl = Eintrag.Bilderliste[Thumbindex].WebUrl;
                  Thumb            = await this.ReadThumbnailinfo(Eintrag.Bilderliste[Thumbindex].FileID, Eintrag.Bilderliste[Thumbindex].WebUrl);

                  if(Thumb !== null) {

                    Thumbnail.fileid        = Thumb.fileid;
                    Thumbnail.smallurl      = Thumb.smallurl;
                    Thumbnail.mediumurl     = Thumb.mediumurl;
                    Thumbnail.largeurl      = Thumb.largeurl;
                    Thumbnail.height.large  = Thumb.height.large;
                    Thumbnail.height.medium = Thumb.height.medium;
                    Thumbnail.height.small  = Thumb.height.small;
                    Thumbnail.width.large   = Thumb.width.large;
                    Thumbnail.width.medium  = Thumb.width.medium;
                    Thumbnail.width.small   = Thumb.width.small;

                    Content              = await this.ReadThumbnailcontent(Thumbnail, Eintrag.Thumbnailsize);
                    let Imagebuffuer     = await Content.arrayBuffer();
                    let Image            = Buffer.from(Imagebuffuer).toString('base64');
                    Thumbnail.Content    = Image;
                  }
                  else {

                    Thumbnail.weburl = null;
                  }

                  if(Eintrag.Thumbnailsize !== 'large') Thumbnailliste[Punkteindex][Zeilenindex][Spaltenindex] = Thumbnail;
                  else {

                    Thumbnailliste[Punkteindex][Zeilenindex][Spaltenindex] = null;

                    BigThumbnailliste.push(Thumbnail);
                    BigThumbnailnummern.push(Eintrag.Nummer);
                  }
                }
                else {

                  Thumbnailliste[Punkteindex][Zeilenindex][Spaltenindex] = null;
                }

                Thumbindex++;
              }
            }
          }

          Punkteindex++
        }

        /*

        for(let Zeile of Thumbnailiste) {

          for(let Thumbeintrag of Zeile) {

            Content              = await this.ReadThumbnailcontent(Thumbeintrag);
            let Imagebuffuer     = await Content.arrayBuffer(); // URL.createObjectURL(Content);
            let Image            = Buffer.from(Imagebuffuer).toString('base64');
            Thumbeintrag.Content = Image;
          }
        }

         */

        Header = '<div id="header-template" style="-webkit-print-color-adjust: exact; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"></div>';
        Footer = '<div id="header-template" style="-webkit-print-color-adjust: exact; display: flex; align-items: center; justify-content: center; width: 100%; height: 24px; font-size:10px !important; background: #7b6a58 !important; color:white; padding-left:10px"><span class="pageNumber"></span> / <span class="totalPages"></span></div>';

        html += '<!DOCTYPE html>';
        html += '<html>';
        html += '<head>';
        html += '<title>` + LOPListe.Titel + `</title>';

        html += '<style>';
        html += 'body { font-family: tahoma; font-size: 10px; }';
        html += '.docinnertable { border:  1px solid #000000; border-collapse: collapse; }';
        html += '.docinnertable td { padding: 4px; border:  1px solid black; }';
        html += '.nobordersmalltable { border-collapse: collapse; }';
        html += '.nobordersmalltable td { padding: 0px; border: none; }';
        html += '@media print { .pagebreak { page-break-before: always; padding: 4px;  } }';
        html += '@media print { .pagebreakafter { page-break-after: always;  } }';
        html += '</style>';

        html += '</head>';
        html += '<body>';

        html += '<div class="pagebreakafter">';

        html += '<table style="width: 100%; border-collapse: collapse;">';
        html += '<tr>';
        html += '<td colspan="2" align="right"><img src="data:image/png;base64,' + imageblob + '" style="width: 198px; height: 68px"/></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="width: 50%" valign="top">';

        // Bericht Infos

        html += '<table class="docinnertable">';
        html += '<tr><td style="font-weight: bold">Berichtbezeichnung</td><td>' + LOPListe.Titel + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Berichtnummer</td><td>' + LOPListe.LOPListenummer + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Datum</td><td>' + LOPListe.Zeitstring + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Projektname</td><td>' + Projekt.Projektname + '</td></tr>';
        html += '<tr><td style="font-weight: bold">Projektnummer</td><td>' + Projekt.Projektnummer + '</td></tr>';
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

        for(let i = 0; i < LOPListe.ExterneTeilnehmerliste.length; i++) {

          html += LOPListe.ExterneTeilnehmerliste[i];
          if(i < LOPListe.ExterneTeilnehmerliste.length - 1) html += ', ';
        }

        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>';

        for(let i = 0; i < LOPListe.InterneTeilnehmerliste.length; i++) {

          html += LOPListe.InterneTeilnehmerliste[i];
          if(i <  LOPListe.InterneTeilnehmerliste.length - 1) html += ', ';
        }

        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<br><br>';

        // Versandinformationen

        if(ShowMailinformations === true) {

          SendeZeitpunkt = moment();
          LOPListe.GesendetZeitstempel = SendeZeitpunkt.valueOf();
          LOPListe.GesendetZeitstring  = SendeZeitpunkt.format('DD.MM.YYYY HH:mm');

          html += '<br><br>';

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 50%">Empfänger</td>';
          html += '<td style="font-weight: bold; width: 50%">Kopienempfänger</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < LOPListe.Empfaengerliste.length; i++) {

            html += LOPListe.Empfaengerliste[i].Email;
            if (i < LOPListe.Empfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '<td style="vertical-align: top">';

          for(let i = 0; i < LOPListe.CcEmpfaengerliste.length; i++) {

            html += LOPListe.CcEmpfaengerliste[i].Email;
            if (i < LOPListe.CcEmpfaengerliste.length - 1) html += '<br>';
          }

          html += '</td>';
          html += '</tr>';
          html += '<tr><td colspan="2">Gesendet: ' + LOPListe.GesendetZeitstring + '</td></tr>';
          html += '</table>';

          html += '</div>';

        // Info Punkte

        html += '<br><br>';

        if(LOPListe.Infopunkteliste.length > 0) {

          html += '<table class="docinnertable" style="width: 100%">';
          html += '<tr>';
          html += '<td colspan="3" style="font-weight: bold; font-size: 120%; color: #307ac1;">Allgemein</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td style="font-weight: bold; width: 20px; text-align: center">Nr.</td>';
          html += '<td style="font-weight: bold; width: 60px; text-align: center">Datum</td>';
          html += '<td style="font-weight: bold; width: auto">Beschreibung</td>';
          html += '</tr>';

          for(let Info of LOPListe.Infopunkteliste) {

            html += '<tr>';
            html += '<td style=" background: #307ac1; color: white; text-align: center;">' + Info.Nummer + '</td>';
            html += '<td style="text-align: center;">' + Info.Startzeitstring + '</td>';
            html += '<td>' + Info.Aufgabe + '</td>';
            html += '</tr>';
          }

          html += '</table>';
        }

        html += '<br><br>';

        // Themnliste

        html += '<table class="docinnertable" style="width: 100%">';
        html += '<tr>';
        html += '<td colspan="8" style="font-weight: bold; font-size: 120%; color: #307ac1;">Themenliste</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td style="font-weight: bold; width: 20px; text-align: center">Nr.</td>';
        html += '<td style="font-weight: bold; width: 60px; text-align: center">Datum</td>';
        html += '<td style="font-weight: bold; width: 100px">Bauteil</td>';
        html += '<td style="font-weight: bold; width: 100px">Thematik</td>';
        html += '<td style="font-weight: bold; width: auto">Beschreibung</td>';
        html += '<td style="font-weight: bold; width: 60px; text-align: center;">Termin</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Status</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Priorität</td>';
        html += '<td style="font-weight: bold; width: 70px; text-align: center;">Zuständig</td>';
        html += '</tr>';


        Punkteindex = 0;

        for(let Thema of LOPListe.Projektpunkteliste) {

          html += '<tr>';
          html += '<td style="text-align: center;">' + Thema.Nummer + '</td>';
          html += '<td style="text-align: center;">' + Thema.Startzeitstring + '</td>';
          html += '<td>' + Thema.Bauteilname + '</td>';
          html += '<td>' + Thema.Thematik + '</td>';
          html += '<td>';

          html += '<table class="nobordersmalltable">';

          html += '<tr>';
          html += '<td>'  + Thema.Aufgabe + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<td>';

          if(Thema.ProtokollShowBilder && Thema.Bilderliste.length > 0 && Thema.Thumbnailsize === 'large') {

            html += '<span style="color: #307ac1">Siehe Bilder im Anhang</span>';
          }

          html += '<table>';

          for(let Zeile of Thumbnailliste[Punkteindex]) {

            html += '<tr>';

            for(let Thumbeintrag of Zeile) {

              html += '<td>';

              if(Thumbeintrag !== null && Thumbeintrag.weburl !== null) {

                html += '<img src="data:image/png;base64,' + Thumbeintrag.Content + '" style="width: ' + Thumbnailbreiteliste[Punkteindex] + 'px">';
              }

              html += '</td>';
            }

            html += '</tr>';
          }

          html += '</table>'

          html += '</td>';
          html += '</tr>';
          html += '</table>'


          html += '</td>';
          html += '<td style="text-align: center;">' + Thema.Endezeitstring + '</td>';
          html += '<td style="text-align: center; color: white !important; background: ' + this.GetStatuscolor(Thema.Status) + ' !important;">';

          // Status

          html += this.GetStatustext(Thema.Status);

          html += '</td>';
          html += '<td style="background: ' + this.GetPrioritaetcolor(Thema) + '; color: white; text-align: center;">';

          // Priorität

          html += Thema.Prioritaet;

          html += '</td>';
          html += '<td style="text-align: center">';

          // Zuständig

          html += '<table class="nobordersmalltable" style="width: 100%">';

          for(let Intern of LOPListe.InternZustaendigListe[Punkteindex]) {

            html += '<tr><td style="text-align: center; font-size: 90%">' + Intern + '</td></tr>';
          }

          if(LOPListe.ExternZustaendigListe[Punkteindex].length > 0) {

            html += '<tr><td style="text-align: center; font-size: 110%; font-weight: bold">&bull;</td></tr>';
          }

          for(let Extern of LOPListe.ExternZustaendigListe[Punkteindex]) {

            html += '<tr><td style="text-align: center; font-size: 90%">' + Extern + '</td></tr>';
          }

          html += '</table>';

          html += '</td>';
          html += '</tr>';

          Punkteindex++;
        }

        html += '</table>';



          // Bilder im Anhang

          Punkteindex = 0;

          for(let BigThumb of BigThumbnailliste) {

            if(BigThumb.height.small > BigThumb.width.small) {

              const buf   = Buffer.from(BigThumb.Content, 'base64');
              const image = await Jimp.read(buf);

              image.rotate(90).getBase64(Jimp.MIME_JPEG, (err, src) => {

                BigThumb.Content = src;

                html += '<div class="pagebreak">';

                html += '<table class="docinnertable" style="width: 100%">';
                html += '<tr>';
                html += '<td style="width: 40px; text-align: center"><b>Nr.</b></td>';
                html += '<td style="width: auto;"><b>Abbildung</b></td>';
                html += '<tr>';
                html += '<td align="center">' + BigThumbnailnummern[Punkteindex] + '</td>';
                html += '<td>';
                html += '<img src="' + BigThumb.Content + '" style="height: 640px;">';
                html += '</td>';
                html += '</tr>';
                html += '</table>';

                html += '</div>';

                Punkteindex++;

              });
            }
            else {

              html += '<div class="pagebreak">';

              html += '<table class="docinnertable" style="width: 100%">';
              html += '<tr>';
              html += '<td style="width: 40px; text-align: center"><b>Nr.</b></td>';
              html += '<td style="width: auto;"><b>Abbildung</b></td>';
              html += '<tr>';
              html += '<td align="center">' + BigThumbnailnummern[Punkteindex] + '</td>';
              html += '<td>';
              html += '<img src="data:image/png;base64,' + BigThumb.Content + '" style="height: 640px;">';
              html += '</td>';
              html += '</tr>';
              html += '</table>';

              html += '</div>';

              Punkteindex++;
            }
          }


          html += '</body>';
          html += '</html>';
        }

        await page.setContent(html, { waitUntil: 'domcontentloaded' });


        const pdf = await page.pdf({
          margin: { top: '50px', right: '30px', bottom: '50px', left: '30px' },
          printBackground: true,
          format: 'A4',
          landscape: true,
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

          console.log('LOP Liste ' + Filename + ' wurde erstellt.');

          putdata.GesendetZeitstempel = LOPListe.GesendetZeitstempel;
          putdata.GesendetZeitstring  = LOPListe.GesendetZeitstring;

          res.status(200).send(putdata);
        }
        catch(error: any) {

          debugger;

          console.error('LOP Liste ' + Filename + ' erstellen fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveLOPListeroutsClass', 'SetRoutes');
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

  GetPrioritaetcolor(punkt: IProjektpunktestruktur): string {

      if(punkt !== null && punkt.Prioritaet !== null) {

        if(punkt.Status === '"Protokollpunkt"') {

          return 'none';
        }
        else {

          switch (punkt.Prioritaet) {

            case 'Niedrig':

              return '#008000';

              break;

            case 'Mittel':

              return 'orange';

              break;

            case 'Hoch':

              return 'red';

              break;
          }
        }
      }
      else return 'green';
  }

  private GetStatuscolor(status): string {

    switch (status) {

      case 'Offen':

        return 'red';

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

        return null;
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

      this.Debug.ShowErrorMessage(error.message, error,  'SaveLOPListeroutsClass', 'ReadThumbnailinfo');
    }
  }

  private async ReadThumbnailcontent(thumb: Thumbnailstruktur, size: string): Promise<any> {

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

      let Url = '/sites/' + this.Const.BAESiteID + '/drive/items/' + thumb.fileid + '/thumbnails/0/' + size + '/content';

      try {

        getdata = await graphClient.api(Url).get();
      }
      catch(error: any) {

        console.error('Bild konnte nicht geladen werden: ' + error.message);

        return Promise.reject(null);
      }

      if(getdata) {

        return Promise.resolve(getdata);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SaveLOPListeroutsClass', 'ReadThumbnailcontent');
    }
  }

  private GetEmptyThumbnail(): Thumbnailstruktur {

    return {
      Content: "",
      fileid: "",
      filename: "",
      height: {large: 0, medium: 0, small: 0},
      id: "",
      largeurl: "",
      mediumurl: "",
      smallurl: "",
      weburl: "",
      width: {large: 0, medium: 0, small: 0}
    };
  }
}


