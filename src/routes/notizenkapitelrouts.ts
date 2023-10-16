import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {INotizenkapitelstruktur} from "../datenstrukturen/notizenkapitelstruktur_server";
import {NotizenkapitelDBClass} from "../database/notizelkapiteldbclass";

export class NotizenkapitelroutsClass {

  public  notizenkapitelrouter: any;
  private Debug: DebugClass;
  private Database: NotizenkapitelDBClass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.Debug                = new DebugClass();
    this.Database             = new NotizenkapitelDBClass();
    this.notizenkapitelrouter = Router();
    this.Authentication       = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.notizenkapitelrouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => {

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('Read Notizenkapitel: ');
        console.log('Projektkey: ' + Projektkey);

        this.Database.ReadNotizenkapitelliste(Projektkey).then((liste: INotizenkapitelstruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.notizenkapitelrouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Notizenkapitel PUT');

        const data = <INotizenkapitelstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateNotizenkapitel(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Titel, Notizenkapitel: data });
          }
          else {

            res.status(404).send({ message: 'Notizenkapitel not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.notizenkapitelrouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Notizenkapitel POST');

        const data = <INotizenkapitelstruktur>req.body;

        console.dir('Daten: ' + JSON.stringify(data));

        this.Database.AddNotizenkapitel(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Titel, Notizenkapitel: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'NotizenkapitelroutsClass', 'SetRoutes');
    }
  }
}


