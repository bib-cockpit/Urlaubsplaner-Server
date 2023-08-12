import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IProtokollstruktur} from "../datenstrukturen/protokollstruktur_server";
import {ProtokollDBClass} from "../database/protokolledbclass";
import {Dir} from "fs";
import {ConfidentialClientApplication} from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import {Sitesstruktur} from "../datenstrukturen/sitesstruktur_server";
import {ConfigClass} from "../configclass";
import {Mailmessagestruktur} from "../datenstrukturen/mailmessagestruktur";

export class SendFestlegungenroutsClass {

  public  sendfestlegungenrouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.sendfestlegungenrouter = Router();
    this.Authentication         = new AuthenticationClass();
  }



  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SendFestlegungenroutsClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public SetRoutes() {

    try {

      let token;
      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.SERVER_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.SERVER_APPLICATION_SECRET;
      let getdata: any;
      let chunk: any;
      let filebuffer;
      let filedata;
      let graphClient;
      let msalClient;
      let tokenRequest;
      let html;

      this.sendfestlegungenrouter.put('/', async (req: Request, res: Response) => {

        filebuffer = [];

        console.log('Send Festlegungen');

        const data: any   = req.body;
        const Betreff     = data.Betreff;
        const Nachricht   = data.Nachricht;
        const TeamsID     = data.TeamsID;
        const UserID      = data.UserID;
        const Token       = data.Token;
        const FileID      = data.FileID;
        const Filename    = data.Filename;

        const Empfaengerliste:   { Name: string, Email: string }[] = data.Empfaengerliste;
        const CcEmpfaengerliste: { Name: string, Email: string }[] = data.CcEmpfaengerliste;

        let ToRecipients: { emailAddress: { address: string; }}[] = [];
        let CcRecipients: { emailAddress: { address: string; }}[] = [];

        for(let Eintrag of Empfaengerliste)   { ToRecipients.push({ emailAddress: { address: Eintrag.Email }});}
        for(let Eintrag of CcEmpfaengerliste) { CcRecipients.push({ emailAddress: { address: Eintrag.Email }});}

        console.log('Daten: ' + JSON.stringify(data));

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

        // Datei laden aus Teams

        let Url = '/groups/' + TeamsID + '/drive/items/' + FileID + '/content';

        try {

          getdata = await graphClient.api(Url).get();
        }
        catch(error: any) {

          console.error('Protokoll senden fehlgeschlagen. Datei exisiert nicht.: ' + error.message);

          res.status(error.statusCode).send({Error: error.message});
        }

        if(getdata) {

          getdata.on('readable', () => {

            while (null !== (chunk = getdata.read())) {

              filebuffer.push(chunk);
            }
          });

          html  = '<html>';
          html += '<head>';
          html += '<title></title>';
          html += '<style>';
          html += 'body { font-family: Calibri; font-size: 15px; }';
          html += '</style>';

          html += '</head>';
          html += '<body>';
          html += this.FormatLinebreaks(Nachricht);
          html += '</body>';
          html += '</html>';

          getdata.on('end', () => {

            filedata = Buffer.concat(filebuffer).toString('base64');

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

            graphClient.api(emailurl).post(sendMail).then((result) => {

              res.status(200).send({Message: 'Ok'});

            }).catch((mailerror: any) => {

              console.error('Festlegungen senden fehlgeschlagen. Sendevorgang fehlerhaft: ' + mailerror.message);

              res.status(400).send({ Message: mailerror.message });
            });
          });

        }

      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SendFestlegungenroutsClass', 'SetRoutes');
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

      this.Debug.ShowErrorMessage(error.message, error, 'SendFestlegungenroutsClass', 'FormatLinebreaks');
    }
  }
}


