import {Request, Response, Router} from 'express';
import {VersionsinfoClass} from '../versionsinfoclass';
import {DebugClass} from "../debug";
import {ConfigClass} from "../configclass";
import {AuthenticationClass} from "../middleware/authentication";
import {Client} from '@microsoft/microsoft-graph-client';
import {ConfidentialClientApplication} from '@azure/msal-node';
import 'isomorphic-fetch';
import {Sitesstruktur} from "../datenstrukturen/sitesstruktur_server";

class SitesrouterClass {

  public  sitesrouter: Router;
  private Debug:  DebugClass;
  private Config: ConfigClass;
  private Auth: AuthenticationClass;
  private Info: VersionsinfoClass;

  constructor() {

    this.sitesrouter = Router();
    this.Auth        = new AuthenticationClass();
    this.Info        = new VersionsinfoClass();
    this.Debug       = new DebugClass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SitesrouterClass', 'Init', this.Debug.Typen.Class);
    }
  }

  SetRoutes() {

    try {

      let token; //       = req.headers.authorization.split(' ')[1];
      let tenantId   = this.Config.TENANT_ID;
      let clientId   = this.Config.SERVER_APPLICATION_ID;
      let endpoint   = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let Secret     = this.Config.SERVER_APPLICATION_SECRET;
      let data: any;
      let Valueliste: any[] = [];
      let Sitesliste: Sitesstruktur[] = [];
      let count;
      let nexturl;
      let Eintrag: Sitesstruktur;

       this.sitesrouter.get('/', async (req: Request, res: Response) => {

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



          // Filtertext = "startsWith(webUrl,'https://burnicklgroup.sharepoint.com/sites')";
          // .filter(Filtertext)

          data = await graphClient.api('/sites').get();

         if(data['@odata.count']) count = data['@odata.count'];

         if(data.value) {

           Valueliste.push(data.value);

           if(data['@odata.nextLink']) {

             do {

               nexturl = data['@odata.nextLink'];
               data    = await graphClient.api(nexturl).get();

               if(data.value) Valueliste.push(data.value);

             }
             while(data['@odata.nextLink']);

             if(data.value) Valueliste.push(data.value);
           }
         }

         for(let i = 0; i < Valueliste.length; i++) {

           let Liste = Valueliste[i];

           for(let j = 0; j < Liste.length; j++) {

             Eintrag = Liste[j];

             if(Eintrag.id) {

                if(Eintrag.id.indexOf('ea457111-b3f1-4c73-a8ae-cb1cbaf6d244') !== -1) {

                  // debugger;
               }
             }
             else {

             }

             if(Eintrag.displayName) {

               if(Eintrag.displayName.indexOf('18-100') !== -1) {

               }
             }
             else {

               // debugger;
             }

             if(Eintrag.webUrl) {

               if(Eintrag.webUrl.indexOf('https://burnicklgroup.sharepoint.com/sites') !== -1) {

                 Sitesliste.push(Eintrag);
               }
             }
           }
         }

         debugger;

         res.status(200).send(Sitesliste);

      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SitesrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}

export { SitesrouterClass };

