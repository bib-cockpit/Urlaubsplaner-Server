import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {ProjektpunkteDBClass} from "../database/projektpunktedbclass";
import {IProjektpunktestruktur} from "../datenstrukturen/projektpunktestruktur_server";

export class ProjektpunkteroutsClass {

  public  projektpunkterouter: any;
  private Debug: DebugClass;
  private Database: ProjektpunkteDBClass;
  private Authentication: AuthenticationClass;
  private Testvar: any;

  constructor() {

    this.Debug               = new DebugClass();
    this.Database            = new ProjektpunkteDBClass();
    this.projektpunkterouter = Router();
    this.Authentication      = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.projektpunkterouter.get('/', this.Authentication.authenticate,  (req: Request, res: Response) => {


        let query      = req.query;
        let Projektkey = <string>query.projektkey;
        let Deleted    = <string>query.deleted === "false" ? false : true;

        console.log('Real Projektpunkte: ');
        console.log('Projektkey: ' + Projektkey);
        console.log('Deleted:    ' + Deleted);

        this.Database.ReadProjektpunkteliste(Projektkey, Deleted).then((liste: IProjektpunktestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.projektpunkterouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Projektpunkt PUT');

        const data = <any>req.body;
        let Projektpunkt: IProjektpunktestruktur;
        let Delete: boolean;
        let IDListe: string[];

        console.log('Daten: ' + JSON.stringify(data));

        Projektpunkt = <IProjektpunktestruktur>data.Projektpunkt;
        IDListe      = <string[]>JSON.parse(data.IDListe);
        Delete       = <boolean>data.Delete;

        if(Delete === false) {

          // Projektpunkt aktualisieren

          this.Database.UpdateProjektpunkt(Projektpunkt).then((result) => {

            if(result !== null) {

              res.status(200).send({ message: 'Saved: ' + data.Aufgabe, Projektpunkt: data });
            }
            else {

              res.status(404).send({ message: 'Projektpunkt not found.', data: null });
            }

          }).catch((error) => {

            res.status(400).send({ message: error.message });
          });

        }
        else {

          // Projektpunkte entgueltig loeschen

          this.Database.RemovePunkteliste(IDListe).then((result) => {

            if(result !== null) {

              res.status(200).send({ message: 'Projektpunte wurden gelöscht' });
            }

          }).catch((error) => {

            res.status(400).send({ message: error.message });
          });
        }

      });

      this.projektpunkterouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Projektpunkt POST');

        const data = <IProjektpunktestruktur>req.body;

        console.dir('Daten: ' + JSON.stringify(data));

        this.Database.AddProjektpunkt(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Aufgabe, Projektpunkt: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteroutsClass', 'SetRoutes');
    }
  }
}


