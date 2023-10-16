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

      let token;
      let tenantId     = this.Config.TENANT_ID;
      let clientId     = this.Config.CLIENT_APPLICATION_ID;
      let endpoint     = this.Config.MICROSOFT_LOGIN_ENDPOINT;
      let AppSecret    = this.Config.CLIENT_APPLICATION_SECRET;
      let data: any;
      let Valueliste: any[];
      let Sitesliste: Sitesstruktur[];
      let count;
      let nexturl;
      let Eintrag: Sitesstruktur;
      let Liste: any[];
      let IDListe: string[];
      let Site: any;

       this.sitesrouter.get('/', async (req: Request, res: Response) => {

         Valueliste = [];
         Sitesliste = [];
         Liste      = [];
         IDListe    = [];

          const msalConfig = {
            auth: {
              clientId:     clientId,
              authority:    endpoint + '/' + tenantId,
              clientSecret: AppSecret,
            }
          };

          const msalClient = new ConfidentialClientApplication(msalConfig);

          const tokenRequest = {
            scopes: ['https://graph.microsoft.com/.default'],
          };

          try {

            token = await msalClient.acquireTokenByClientCredential(tokenRequest);
          }
          catch(error)  {

            res.status(400).send(error);
         }

          const graphClient = Client.init({

            authProvider: done => {

              done(null, token.accessToken);
            }
          });

         let SiteID = 'baeeu.sharepoint.com,1b93d6ea-3f8b-4416-9ff1-a50aaba6f8ca,134790cc-e062-4882-ae5e-18813809cc87'; // Projekte Seite
         let ListID = '1a2c3717-1f1d-42a3-9c91-bcce4731abce'; // Dokumente Liste

         data = await graphClient.api('/sites/' + SiteID + '/drive/items/root/children').get();

         // if(data['@odata.count']) count = data['@odata.count'];

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

           Liste = Valueliste[i];

           for(let j = 0; j < Liste.length; j++) {

             Eintrag = Liste[j];

             if(Eintrag.displayName === 'Projekte') {

               if(IDListe.indexOf(Eintrag.id) === -1) {

                 IDListe.push(Eintrag.id);
                 Sitesliste.push(Eintrag);
               }
             }
           }
         }

         if(Sitesliste.length > 0) {

           Site = Sitesliste[0];
           Valueliste = [];

           console.log(Site);


           try {

             //  + ListID + '/items'

            data = await graphClient.api('/me/drive'); // /sites/' + SiteID + '/drive'); // lists/' + ListID).get();
           }
           catch(error) {

             debugger;
           }


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

             Liste = Valueliste[i];

             for(let j = 0; j < Liste.length; j++) {

               Eintrag = Liste[j];
               Sitesliste.push(Eintrag);

               /*
               if(Eintrag.displayName === 'Projekte') {

                 if(IDListe.indexOf(Eintrag.id) === -1) {

                   IDListe.push(Eintrag.id);
                 }
               }

                */
             }
           }
         }




         res.status(200).send(Sitesliste);

      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SitesrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}

export { SitesrouterClass };

