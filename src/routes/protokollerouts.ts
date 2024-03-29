import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IProtokollstruktur} from "../datenstrukturen/protokollstruktur_server";
import {ProtokollDBClass} from "../database/protokolledbclass";

export class ProtokolleroutsClass {

  public  protokolllerouter: any;
  private Debug: DebugClass;
  private Database: ProtokollDBClass;
  private Authentication: AuthenticationClass;
  private Testvar: any;

  constructor() {

    this.Debug             = new DebugClass();
    this.Database          = new ProtokollDBClass();
    this.protokolllerouter = Router();
    this.Authentication    = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.protokolllerouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => {

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('Read Protokolle: ');
        console.log('Projektkey: ' + Projektkey);

        this.Database.ReadProtkollliste(Projektkey).then((liste: IProtokollstruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.protokolllerouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Protokoll PUT');

        const data = <any>req.body;
        const Protokoll: IProtokollstruktur = data.Protokoll;
        const Delete: boolean               = data.Delete;

        console.log('Protokoll: ' + JSON.stringify(Protokoll));

        if(Delete === false) {

          // Update

          this.Database.UpdateProtokoll(Protokoll).then((result) => {

            if(result !== null) {

              res.status(200).send({ message: 'Saved: ' + data.Titel, Protokoll: Protokoll });
            }
            else {

              res.status(404).send({ message: 'Protokolle not found.', data: null });
            }

          }).catch((error) => {

            res.status(400).send({ message: error.message });
          });
        }
        else {

          this.Database.RemoveProtokoll(Protokoll).then(() => {

            res.status(200).send({ message: 'Protokoll wurde gelöscht: ' + Protokoll.Titel, Protokoll: Protokoll });

          }).catch((error) => {

            res.status(400).send({message: error.message});
          })
        }

      });

      this.protokolllerouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Protokoll POST');

        const data = <IProtokollstruktur>req.body;

        console.dir('Daten: ' + JSON.stringify(data));

        this.Database.AddProtokoll(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Titel, Protokoll: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollroutsClass', 'SetRoutes');
    }
  }
}


