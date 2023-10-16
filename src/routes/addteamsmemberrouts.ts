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

export class AddTeamsmemberroutsClass {

  public  teamsmemberrouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.teamsmemberrouter      = Router();
    this.Authentication         = new AuthenticationClass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'TesterroutsClass', 'Init', this.Debug.Typen.Class);
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
      let Url: string;

      this.teamsmemberrouter.put('/', async (req: Request, res: Response) => {

        const data: any   = req.body;
        const UserID      = data.UserID;
        const TeamsID     = data.TeamsID;

        console.log('Daten: ' + JSON.stringify(data));

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

        try {

          token = await msalClient.acquireTokenByClientCredential(tokenRequest);
        }
        catch (error) {

          debugger;
        }

        const graphClient = Client.init({

          authProvider: done => {

            done(null, token.accessToken);
          }
        });

        Url = '/teams/' + TeamsID + '/members';

        try {

          const conversationMember = {
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            'user@odata.bind': "https://graph.microsoft.com/v1.0/users('" + UserID + "')"
          };

          getdata = await graphClient.api(Url).post(conversationMember);

          console.log('Anfrage wurde ausgeführt.');

          res.status(200).send(getdata);
        }
        catch(error: any) {

          console.error('Abfrage fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'TesterroutsClass', 'SetRoutes');
    }
  }
}


