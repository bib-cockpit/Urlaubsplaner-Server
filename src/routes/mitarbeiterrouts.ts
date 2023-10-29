import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {MitarbeiterDBClass} from "../database/mitarbeiterdbclass";
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import {AuthenticationClass} from "../middleware/authentication";

class MitarbeiterrouterClass {

  private Debug: DebugClass;
  public  mitarbeiterrouter: any;
  private Database: MitarbeiterDBClass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.mitarbeiterrouter = Router();
    this.Debug             = new DebugClass();
    this.Database          = new MitarbeiterDBClass();
    this.Authentication    = new AuthenticationClass();
  }

  SetRoutes() {

    try {

      // Mitarbeiterliste lesen

      this.mitarbeiterrouter.get('/', this.Authentication.authenticate, (req: Request, res: Response) => {

        this.Database.ReadMitarbeiterliste().then((liste: IMitarbeiterstruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      // POST ist für neuen Mitarbeiter

      this.mitarbeiterrouter.post('/', (req: Request, res: Response) => {

        console.log('Mitarbeiter POST');

        const Mitarbeiter = <IMitarbeiterstruktur>req.body;

        delete Mitarbeiter._id;

        console.log('Daten: ' + JSON.stringify(Mitarbeiter));

        this.Database.AddMitarbeiter(Mitarbeiter).then((result) => {

          res.status(200).send({ message: 'Added: ' + Mitarbeiter.Name, Mitarbeiter: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.mitarbeiterrouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Mitarbeiter PUT');

        const data = <IMitarbeiterstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateMitarbeiter(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Name, Mitarbeiter: data });
          }
          else {

            res.status(404).send({ message: 'Mitarbeiter not found.', Mitarbeiter: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'MitarbeiterrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}


export { MitarbeiterrouterClass };

