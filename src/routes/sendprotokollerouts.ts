import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {ProtokollDBClass} from "../database/protokolledbclass";
import {ConfidentialClientApplication} from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import {ConfigClass} from "../configclass";
import {Mailmessagestruktur} from "../datenstrukturen/mailmessagestruktur";
import {Constclass} from "../constclass";
import fs from "fs";

export class SendProtokolleroutsClass {

  public  sendprotokolllerouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;
  private Const: Constclass;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.sendprotokolllerouter  = Router();
    this.Authentication         = new AuthenticationClass();
    this.Const                  = new Constclass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SendProtokolleroutsClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public SetRoutes() {

    try {

      let token;
      let tenantId: string;
      let clientId: string;
      let endpoint: string;
      let Secret: string;
      let getdata: any; // ReadableStream;
      let chunk: any;
      let filebuffer;
      let filedata;
      let graphClient;
      let msalClient;
      let tokenRequest;
      let html;

      this.sendprotokolllerouter.put('/', async (req: Request, res: Response) => {

        tenantId   = this.Config.TENANT_ID;
        clientId   = this.Config.CLIENT_APPLICATION_ID;
        endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
        Secret     = this.Config.CLIENT_APPLICATION_SECRET;
        filebuffer = [];

        console.log('Send Protokoll');

        const data: any   = req.body;
        const Betreff     = data.Betreff;
        const Nachricht   = data.Nachricht;
        let   Signatur    = data.Signatur;
        const FileID      = data.FileID;
        const Filename    = data.Filename;
        const UserID      = data.UserID;
        const Token       = data.Token;
        const logoimageblob = await this.ReadLogo();

        const Empfaengerliste:   { Name: string, Email: string }[] = data.Empfaengerliste;
        const CcEmpfaengerliste: { Name: string, Email: string }[] = data.CcEmpfaengerliste;

        let ToRecipients: { emailAddress: { address: string; }}[] = [];
        let CcRecipients: { emailAddress: { address: string; }}[] = [];

        for(let Eintrag of Empfaengerliste)   { ToRecipients.push({ emailAddress: { address: Eintrag.Email }});}
        for(let Eintrag of CcEmpfaengerliste) { CcRecipients.push({ emailAddress: { address: Eintrag.Email }});}

        // console.log('Daten: ' + JSON.stringify(data));

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

        try {

          token = await msalClient.acquireTokenByClientCredential(tokenRequest);

          graphClient = Client.init({

            authProvider: done => {

              done(null, token.accessToken);
            }
          });
        }
        catch(error) {

          console.log('Tokenerror' + error.message);

          res.status(error.statusCode).send({Error: error.message});
        }

        // Datei laden aus Teams

        let Url = '/sites/' + this.Const.BAESiteID + '/drive/items/' + FileID + '/content';

        try {

          getdata = await graphClient.api(Url).get();
        }
        catch(error: any) {

          console.log('Protokoll senden fehlgeschlagen. Datei exisiert nicht.: ' + error.message);

          res.status(error.statusCode).send({Error: error.message});
        }

        if(getdata) {

          console.log('getdata ist ok');
          console.log(getdata);

          if(typeof getdata.on !== 'undefined') {

            getdata.on('readable', () => {

              while (null !== (chunk = getdata.read())) {

                filebuffer.push(chunk);
              }
            });

            getdata.on('end', () => {

              console.log('getdata.on(end)');

              filedata = Buffer.concat(filebuffer).toString('base64');

              Signatur = Signatur.replace('[Image]', 'data:image/png;base64,' + logoimageblob);

              html  = '<html lang="de">';
              html += '<head title="Protokoll">';
              html += '<title></title>';
              html += '<style>';
              html += 'body { font-family: Courier New; font-size: 15px; }';
              html += '</style>';

              html += '</head>';
              html += '<body>';
              html += this.FormatLinebreaks(Nachricht);
              html += '<br><br>';
              html += Signatur;
              html += '</body>';
              html += '</html>';

              const sendMail: Mailmessagestruktur = {
                message: {
                  subject: Betreff,
                  body: {
                    contentType: 'html',
                    content: html
                  },
                  toRecipients: ToRecipients,
                  attachments: [
                    {
                      "@odata.type": "#microsoft.graph.fileAttachment",
                      contentBytes:  filedata,
                      name:          Filename,
                      contentType:  "application/pdf"
                    }
                  ]
                },
                saveToSentItems: true
              };

              if(CcRecipients.length > 0) sendMail.message.ccRecipients = CcRecipients;

              graphClient = Client.init({

                authProvider: done => {

                  done(null, Token);
                }
              });

              let emailurl = '/users/' + UserID + '/sendMail';

              graphClient.api(emailurl).post(sendMail).then(() => {

                res.status(200).send({Message: 'Ok'});

              }).catch((mailerror: any) => {

                console.log('Protokoll senden fehlgeschlagen. Sendevorgang fehlerhaft: ' + mailerror.message);

                res.status(400).send({ Message: mailerror.message });
              });
            });

          }
          else {

            console.log('getdata.on is undefined');

            res.status(400).send({ Message: 'Object On Error' });
          }

        }
        else {

          console.log('getdata ist nicht bereit.');
          console.log('Url: ' + Url);

          res.status(400).send({ Message:  'getdata ist nicht bereit.'});
        }

      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SendProtokolleroutsClass', 'SetRoutes');
    }
  }

  public FormatLinebreaks(text: string): string {

    try {

      if(typeof text !== 'undefined') {

        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      }
      else {

        return '';
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error, 'SendProtokolleroutsClass', 'FormatLinebreaks');
    }
  }

  private async ReadLogo(): Promise<any> {

    return new Promise((resolve) => {

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


