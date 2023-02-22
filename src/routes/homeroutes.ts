import express, {Application, Request, Response, Router} from 'express';
import {VersionsinfoClass} from '../versionsinfoclass';
import {DebugClass} from "../debug";
import {ConnectionClass} from "../connectionclass";
import {ConfigClass} from "../configclass";

const Info = new VersionsinfoClass();

class HomerouterClass {

  public homerouter: any; //  = Router();
  private Debug: DebugClass;
  private Config: ConfigClass;

  constructor() {

    this.homerouter = Router();
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

      this.homerouter.get('/', (req: Request, res: Response) => {

        html =
          `<body style="font-family: Tahoma"><b>Cockpit Server</b><br><br>
           <table>
           <tr>
              <td>Versionsnummer:</td><td>${Info.Verion}</td>
          </tr>
          <tr>
              <td>Versionsdatum:</td><td>${Info.Versionsdatum}</td>
          </tr>
          <tr>
              <td>Environment (original):</td><td>${process.env.NODE_ENV}</td>
          </tr>
          <tr>
              <td>Environment (config):</td><td>${this.Config.NODE_ENV}</td>
          </tr>
          <tr>
              <td>Statusmessage:</td><td>${this.Config.Statusmessage}</td>
          </tr>
          <tr>
              <td>SecretKey:</td><td>${this.Config.SecretKey}</td>
          </tr>
          <tr>
              <td>DB Name:</td><td>${this.Config.COSMOSDB_DBNAME}</td>
          </tr>
          <tr>
              <td>DB Host:</td><td>${this.Config.COSMOSDB_HOST}</td>
          </tr>
          <tr>
              <td>DB Unsername:</td><td>${this.Config.COSMOSDB_USER}</td>
          </tr>
          <tr>
              <td>DB Passwort:</td><td>${this.Config.COSMOSDB_PASSWORD}</td>
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

