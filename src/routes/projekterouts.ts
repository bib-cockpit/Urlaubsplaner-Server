import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IProjektestruktur} from "../datenstrukturen/projektestruktur_server";
import {ProjekteDBClass} from "../database/projektedbclass";

export class ProjekteroutsClass {

  public  projekterouter: any;
  private Debug: DebugClass;
  private Database: ProjekteDBClass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.Debug           = new DebugClass();
    this.Database        = new ProjekteDBClass();
    this.projekterouter  = Router();
    this.Authentication  = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.projekterouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => { //

        this.Debug.ShowInfoMessage('Projekterouten GET Anfrage -> Projektliste auslesen', 'ProjekteroutsClass', 'SetRoutes');

        this.Database.ReadProjektliste().then((liste: IProjektestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.projekterouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        const data = <IProjektestruktur>req.body;

        this.Debug.ShowInfoMessage('Projekterouten PUT Anfrage -> Projekt aktuallisieren', 'ProjekteroutsClass', 'SetRoutes');

        this.Database.UpdateProjekt(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Projektname, data: data });
          }
          else {

            res.status(404).send({ message: 'Projekt not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.projekterouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        this.Debug.ShowInfoMessage('Projekterouten POST Anfrage -> Projekt hinzufuegen', 'ProjekteroutsClass', 'SetRoutes');

        const data = <IProjektestruktur>req.body;

        this.Database.AddProjekt(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Projektname, data: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjekterouterClass', 'SetRoutes');
    }
  }
}


