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

  constructor() {

    this.Debug             = new DebugClass();
    this.Database          = new ProtokollDBClass();
    this.protokolllerouter = Router();
    this.Authentication    = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.protokolllerouter.get('/', this.Authentication.check,  (req: Request, res: Response) => {

        res.setHeader('Access-Control-Allow-Origin',  '*');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('ReaD Protokolle: ');
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

        const data = <IProtokollstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateProtokoll(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Titel, Protokoll: data });
          }
          else {

            res.status(404).send({ message: 'Protokolle not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
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


