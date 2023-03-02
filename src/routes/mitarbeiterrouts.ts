import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {MitarbeiterDBClass} from "../database/mitarbeiterdbclass";
import * as jwt from 'jsonwebtoken';
import {IMitarbeiterstruktur} from "../datenstrukturen/mitarbeiterstruktur_server";
import {ConfigClass} from "../configclass";

class MitarbeiterrouterClass {

  private Debug: DebugClass;
  public  mitarbeiterrouter: any;
  private Database: MitarbeiterDBClass;

  constructor() {

    this.mitarbeiterrouter = Router();
    this.Debug             = new DebugClass();
    this.Database          = new MitarbeiterDBClass();
  }

  GetToken(mitarbeiter: IMitarbeiterstruktur): string {

    return jwt.sign({

      Name:    mitarbeiter.Name,
      Vorname: mitarbeiter.Vorname,
      Email:   mitarbeiter.Email

    }, process.env.COCKPIT_JWTSecretKey);
  }

  SetRoutes() {

    try {

      // Mitarbeiterliste lesen

      let token: string;

      this.mitarbeiterrouter.get('/', (req: Request, res: Response) => {

        let query = req.query;
        let email = <string>query.email;
        let Daten: any = null;

        res.setHeader('Access-Control-Allow-Origin',  '*');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');


        this.Debug.ShowInfoMessage('Mitarbeiterrouten GET Request -> Emailadresse: ' + email, 'Mitarebiterrouts', 'SetRoutes');

        debugger;


        if(email) {

          this.Debug.ShowInfoMessage('Mitarbeiterdaten auslesen: ' + email, 'Mitarebiterrouts', 'SetRoutes');

          this.Database.ReadMitarbeiter(email).then((mitarbeiter: IMitarbeiterstruktur) => {

            if(mitarbeiter === null) {

              Daten = null;

              this.Debug.ShowInfoMessage('Mitarbeiter nicht gefunden.', 'Mitarebiterrouts', 'SetRoutes');
            }
            else {

              this.Debug.ShowInfoMessage('Mitarbeiter gefunden.', 'Mitarebiterrouts', 'SetRoutes');

              token = this.GetToken(mitarbeiter);

              Daten = {

                Mitrabeiter: mitarbeiter,
                Token: token
              };
            }

            res.status(200).send(Daten);

          }).catch((error) => {

            res.status(400).send(error.message);

          });
        }
        else {

          this.Database.ReadMitarbeiterliste().then((liste: IMitarbeiterstruktur[]) => {


            res.status(200).send(liste);

          }).catch((error) => {

            res.status(400).send(error.message);

          });
        }

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

