import {NextFunction, Request, Response, Router} from 'express';
import {VersionsinfoClass} from '../versionsinfoclass';
import {DebugClass} from "../debug";
import {ConfigClass} from "../configclass";
import {AuthenticationClass} from "../middleware/authentication";

class HomerouterClass {

  public  homerouter: Router;
  private Debug:  DebugClass;
  private Config: ConfigClass;
  private Auth: AuthenticationClass;
  private Info: VersionsinfoClass;

  constructor() {

    this.homerouter = Router();
    this.Auth       = new AuthenticationClass();
    this.Info       = new VersionsinfoClass();
    this.Debug      = new DebugClass();
  }

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'HomerouterClass', 'Init', this.Debug.Typen.Class);
    }
  }

  SetRoutes() {

    try {

      let html: string;
      let Filename: string = __filename;
      let Dirname: string  = __dirname;
      let CWD: string  = process.cwd();

      this.homerouter.get('/', (req: Request, res: Response, next: NextFunction) => {

        html =
          `<body style="font-family: Tahoma"><b>Cockpit Server</b><br><br>
           <table>
           <tr>
              <td>Versionsnummer:</td><td>${this.Info.Verion}</td>
          </tr>
          <tr>
              <td>Versionsdatum:</td><td>${this.Info.Versionsdatum}</td>
          </tr>
          <tr>
              <td>Environment (original):</td><td>${process.env.NODE_ENV}</td>
          </tr>
          <tr>
              <td>CWD:</td><td>${CWD}</td>
          </tr>
          <tr>
              <td>Filename:</td><td>${Filename}</td>
          </tr>
          <tr>
              <td>Dirname:</td><td>${Dirname}</td>
          </tr>
          <tr>
              <td>NODE ENV:</td><td>${this.Config.NODE_ENV}</td>
          </tr>
           <tr>
              <td>PORT:</td><td>${this.Config.PORT}</td>
          </tr>
          <tr>
              <td>Statusmessage:</td><td>${this.Config.Statusmessage}</td>
          </tr>
          <tr>
              <td>DB Name:</td><td>${this.Config.COSMOSDB_DBNAME}</td>
          </tr>
          <tr>
              <td>DB Host:</td><td>${this.Config.COSMOSDB_HOST}</td>
          </tr>
          <tr>
              <td>DB Port:</td><td>${this.Config.COSMOSDB_PORT}</td>
          </tr>
          <tr>
              <td>DB Unsername:</td><td>${this.Config.COSMOSDB_USER}</td>
          </tr>
          <tr>
              <td>DB Passwort:</td><td>${this.Config.COSMOSDB_PASSWORD}</td>
          </tr>
          <tr>
              <td>TENANT ID:</td><td>${this.Config.TENANT_ID}</td>
          </tr>
          <tr>
              <td>SERVER APPLICATION ID:</td><td>${this.Config.SERVER_APPLICATION_ID}</td>
          </tr>
          </table>
        </body>`;

        res.status(200).send(html);
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'HomerouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}

export { HomerouterClass };

