import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {MitarbeiterDBClass} from "../database/mitarbeiterdbclass";
import * as jwt from 'jsonwebtoken';
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

  GetToken(mitarbeiter: IMitarbeiterstruktur): string {

    return jwt.sign({

      Name:    mitarbeiter.Name,
      Vorname: mitarbeiter.Vorname,
      Email:   mitarbeiter.Email

    }, process.env.COCKPIT_JWTSecretKey);
  }

  SetRoutes() {

    // https://bib-cockpit-server.azurewebsites.net/.auth/login/aad/callback'

    try {

      // Mitarbeiter lesen ob dieser existiert

      let token: string;

      // , this.Authentication.check

      this.registrierungrouter.get('/',  (req: Request, res: Response) => {

        /*
        res.setHeader('Access-Control-Allow-Origin',  '*');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

         */

        this.Debug.ShowInfoMessage('Registirierung GET Methode', 'registrierungrouterClass', 'SetRoutes');

        let query = req.query;
        let email = <string>query.email;
        let Daten: any = null;

        this.Database.ReadMitarbeiter(email).then((mitarbeiter: IMitarbeiterstruktur) => {

          if(mitarbeiter === null) {

            Daten = null;
          }
          else {

            token = this.GetToken(mitarbeiter);

            Daten = {

              Mitarbeiter: mitarbeiter,
              Token: token
            };
          }



          res.status(200).send(Daten);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      // POST ist für neuen Mitarbeiter

      this.registrierungrouter.post('/',  (req: Request, res: Response) => { // this.Authentication.check,

        console.log('Mitarbeiter POST');

        const Mitarbeiter = <IMitarbeiterstruktur>req.body;

        delete Mitarbeiter._id;

        console.log('Daten: ' + JSON.stringify(Mitarbeiter));

        this.Database.AddMitarbeiter(Mitarbeiter).then((result) => {

          token = this.GetToken(Mitarbeiter);

          res.status(200).send({ message: 'Added: ' + Mitarbeiter.Name, Token: token, Mitarbeiter: result._doc });

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

