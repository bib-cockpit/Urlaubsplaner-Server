import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {MitarbeiterDBClass} from "../database/mitarbeiterdbclass";
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import {AuthenticationClass} from "../middleware/authentication";

class RegistrierungrouterClass {

  private Debug: DebugClass;
  public  registrierungrouter: any;
  private Database: MitarbeiterDBClass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.registrierungrouter = Router();
    this.Debug               = new DebugClass();
    this.Database            = new MitarbeiterDBClass();
    this.Authentication      = new AuthenticationClass();
  }

  SetRoutes() {

    try {

      // Mitarbeiter lesen ob dieser existiert


      this.registrierungrouter.get('/', this.Authentication.authenticate, (req: Request, res: Response) => {

        this.Debug.ShowInfoMessage('Registirierung GET Methode', 'registrierungrouterClass', 'SetRoutes');

        let query = req.query;
        let email = <string>query.email;
        let Daten: any = null;

        res.setHeader('Access-Control-Allow-Origin',  '*');

        this.Database.ReadMitarbeiter(email).then((mitarbeiter: IMitarbeiterstruktur) => {

          if(mitarbeiter === null) {

            Daten = null;
          }
          else {

            Daten = {

              Mitarbeiter: mitarbeiter,
            };
          }
          res.status(200).send(Daten);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      // POST ist für neuen Mitarbeiter

      this.registrierungrouter.post('/',  (req: Request, res: Response) => {

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


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'registrierungrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}


export { RegistrierungrouterClass };

