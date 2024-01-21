import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {SimontabelleDBClass} from "../database/simontabelledbclass";
import {ISimontabellestruktur} from "../datenstrukturen/simontabellestruktur_server";
import {ConfigClass} from "../configclass";

export class SimontabelleroutsClass {

  public  simontabellerouter: any;
  private Debug: DebugClass;
  private Database: SimontabelleDBClass;
  private Authentication: AuthenticationClass;
  private Config: ConfigClass;

  constructor() {

    this.Debug             = new DebugClass();
    this.Database          = new SimontabelleDBClass();
    this.simontabellerouter = Router();
    this.Authentication    = new AuthenticationClass();
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

      this.simontabellerouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => {

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('Read Simontabellen: ');
        console.log('Projektkey: ' + Projektkey);

        this.Database.ReadSimontabelleliste(Projektkey).then((liste: ISimontabellestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.simontabellerouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Simontabelle PUT');

        const data = <any>req.body;
        const Simontabelle: ISimontabellestruktur = data.Simontabelle;
        const Delete: boolean                     = data.Delete;

        console.log('Simontabelle: ' + JSON.stringify(Simontabelle));

        if(Delete === false) {

          // Update

          this.Database.UpdateSimontabelle(Simontabelle).then((result) => {

            if(result !== null) {

              res.status(200).send({ message: 'Saved: ' + data.Titel, Simontabelle: Simontabelle });
            }
            else {

              res.status(404).send({ message: 'Simontabelle not found.', data: null });
            }

          }).catch((error) => {

            res.status(400).send({ message: error.message });
          });
        }
        else {

          this.Database.RemoveSimontabelle(Simontabelle).then(() => {

            res.status(200).send({ message: 'Simontabelle wurde gelöscht', Simontabelle: Simontabelle });

          }).catch((error) => {

            res.status(400).send({message: error.message});
          })
        }

      });

      this.simontabellerouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Simontabelle POST');

        const data = <ISimontabellestruktur>req.body;

        console.dir('Daten: ' + JSON.stringify(data));

        this.Database.AddSimontabelle(data).then((result) => {

          res.status(200).send({ message: 'Simontabelle added', Simontabelle: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleroutsClass', 'SetRoutes');
    }
  }
}


