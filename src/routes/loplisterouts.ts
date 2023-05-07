import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {LOPListeDBClass} from "../database/loplistedbclass";
import {ILOPListestruktur} from "../datenstrukturen/loplistestruktur_server";

export class LOPListeroutsClass {

  public  loplisterouter: any;
  private Debug: DebugClass;
  private Database: LOPListeDBClass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.Debug             = new DebugClass();
    this.Database          = new LOPListeDBClass();
    this.loplisterouter    = Router();
    this.Authentication    = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.loplisterouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => {

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('Read LOP Liste: ');
        console.log('Projektkey: ' + Projektkey);

        this.Database.ReadLOPListe(Projektkey).then((liste: ILOPListestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.loplisterouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('LOP Liste PUT');

        const data = <ILOPListestruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateLOPListe(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Titel, LOPListe: data });
          }
          else {

            res.status(404).send({ message: 'LOP Liste not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.loplisterouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('LOP Liste POST');

        const data = <ILOPListestruktur>req.body;

        console.dir('Daten: ' + JSON.stringify(data));

        this.Database.AddLOPListe(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Titel, LOPListe: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'LOPListeroutsClass', 'SetRoutes');
    }
  }
}


