import express, {Application, Request, Response, Router} from 'express';
import {VersionsinfoClass} from '../versionsinfoclass';
import {DebugClass} from "../debug";
import {ConnectionClass} from "../connectionclass";
import {Configclass} from "../configclass";

const Info             = new VersionsinfoClass();
const Connection       = new ConnectionClass();
const app: Application = express();
const Environment      = app.get('env');
const Config           = new Configclass();

class HomerouterClass {

  public homerouter: any; //  = Router();
  private Debug: DebugClass;

  constructor() {

    this.homerouter = Router();
    this.Debug      = new DebugClass();
  }

  SetRoutes(env: string) {

    try {

      this.homerouter.get('/', (req: Request, res: Response) => {

        let html: string =
          `<body style="font-family: Tahoma"><b>Cockpit Server</b><br><br>
       <table>
       <tr>
          <td>Versionsnummer:</td><td>${Info.Verion}</td>
      </tr>
      <tr>
          <td>Versionsdatum:</td><td>${Info.Versionsdatum}</td>
      </tr>
      <tr>
          <td>Environment from Express (env):</td><td>${Environment}</td>
      </tr>
      <tr>
          <td>Environment from Environment (NODE_ENV):</td><td>${process.env.NODE_ENV}</td>
      </tr>
      <tr>
          <td>DB Unsername:</td><td>${Connection.COSMOSDB_USER}</td>
      </tr>
      <tr>
          <td>DB Passwort:</td><td>${Connection.COSMOSDB_PASSWORD}</td>
      </tr>
      <tr>
          <td>DB Passwort from config Environment (gespiegelt):</td><td>${Config.get('passwort')}</td>
      </tr>
      <tr>
          <td>DB Passwort from config Environment (env abfrage):</td><td>${Config.getEnv('COSMOSDB_PASSWORD')}</td>
      </tr>
      </table>
      </body>
    `;
        res.status(200).send(html);
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'HomerouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}


export { HomerouterClass };

