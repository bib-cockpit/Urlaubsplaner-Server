import {Request, Response, Router} from 'express';

import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IBautagebuchstruktur} from "../datenstrukturen/bautagebuchstruktur_server";
import {BautagebuchDBClass} from "../database/bautagebuchdbclass";

export class BautagebuchouterClass {

  public  bautagebuchouter: any;
  private Debug: DebugClass;
  private Database: BautagebuchDBClass;
  private Authentication: AuthenticationClass;

  constructor() {


    this.Debug           = new DebugClass();
    this.Database        = new BautagebuchDBClass();
    this.bautagebuchouter = Router();
    this.Authentication  = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.bautagebuchouter.get('/',  (req: Request, res: Response) => {

        this.Database.Readbautagebuchliste().then((liste: IBautagebuchstruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.bautagebuchouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Bautagebuch PUT');

        const data = <IBautagebuchstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateBautagebuch(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Bezeichnung, data: data });
          }
          else {

            res.status(404).send({ message: 'Bautagebuch not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.bautagebuchouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Bautagebuch POST');

        const data = <IBautagebuchstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.AddBautagebuch(data).then((result) => {



          res.status(200).send({ message: 'Added: ' + data.Bezeichnung, data: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'BautagebuchouterClass', 'SetRoutes');
    }
  }
}



