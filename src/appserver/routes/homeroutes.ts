import {Request, Response, Router} from 'express';
import {VersionsinfoClass} from '../versionsinfoclass';
import {DebugClass} from "../debug";

const Info = new VersionsinfoClass();

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
          <td>Environment:</td><td>${env}</td>
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

