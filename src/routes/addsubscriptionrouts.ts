import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {ProtokollDBClass} from "../database/protokolledbclass";
import moment, {Moment} from "moment";
import {ConfidentialClientApplication} from "@azure/msal-node";
import {Client} from "@microsoft/microsoft-graph-client";
import {ConfigClass} from "../configclass";

export class AddsubscriptionroutsClass {

  public  subscriptionrouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;

  constructor() {

    this.Debug                  = new DebugClass();
    this.Database               = new ProtokollDBClass();
    this.subscriptionrouter     = Router();
    this.Authentication         = new AuthenticationClass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'AddsubscriptionroutsClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public SetRoutes() {

    try {

      let token;
      let tenantId      = this.Config.TENANT_ID;
      let clientId      = this.Config.SERVER_APPLICATION_ID;
      let endpoint      = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret        = this.Config.SERVER_APPLICATION_SECRET;
      let Heute: Moment = moment();
      let getdata: any;
      let Expiration: Moment = Heute.clone().add(2, 'day');
      let CallbackUrl: string = 'https://bae-cockpit-server.azurewebsites.net/eventcallback';

      this.subscriptionrouter.post('/', async (req: Request, res: Response) => {

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

        // unauthorized_client: 700016 - [2023-08-20 12:53:17Z]: AADSTS700016: Application with identifier '"8289bad1-d444-4958-9033-832603d0e244",' was not found in the directory 'B-A-E GmbH (EU)'. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You may have sent your authentication request to the wrong tenant.
        // Trace ID: 175bf761-264d-4347-8f16-3a1154710201
        // Correlation ID: ed922f94-0aef-415f-bca4-0620b40e8b7b
        // Timestamp: 2023-08-20 12:53:17Z - Correlation ID: ed922f94-0aef-415f-bca4-0620b40e8b7b - Trace ID: 175bf761-264d-4347-8f16-3a1154710201

        const graphClient = Client.init({

          authProvider: done => {

            done(null, token.accessToken);
          }
        });


        try {

          const subscription = {
            changeType: 'created',
            notificationUrl: CallbackUrl,
            resource: '/me/contacts',
            expirationDateTime: Expiration.format('YYYY-MM-DD') + 'T23:00:00.0+00:00',
            clientState: Secret,
          };

          getdata = await graphClient.api('/subscriptions').post(subscription);

          console.log('Anfrage wurde ausgeführt.');

          res.status(200).send(getdata);
        }
        catch(error: any) {

          console.error('Abfrage fehlgeschlagen: ' + error.message);

          res.status(error.statusCode).send({ Error: error.message });
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'AddsubscriptionroutsClass', 'SetRoutes');
    }
  }
}


