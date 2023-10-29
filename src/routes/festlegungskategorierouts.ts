import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {FestlegungskategorieDBClass} from "../database/festlegungskategoriedbclass";
import {IFestlegungskategoriestruktur} from "../datenstrukturen/festlegungskategoriestruktur_server";

export class FestlegungskategorieouterClass {

  public  festlegungskategorierouter: any;
  private Debug: DebugClass;
  private Database: FestlegungskategorieDBClass;
  private Authentication: AuthenticationClass;
  private Testvar: any;

  constructor() {

    this.Debug           = new DebugClass();
    this.Database        = new FestlegungskategorieDBClass();
    this.festlegungskategorierouter = Router();
    this.Authentication  = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.festlegungskategorierouter.get('/',  this.Authentication.authenticate,  (req: Request, res: Response) => {

        let query = req.query;
        let Projektkey = <string>query.projektkey;

        console.log('Real Festlegungskategorien: ');
        console.log('Projektkey: ' + Projektkey);

        this.Database.ReadFestlegungskategorieliste(Projektkey).then((liste: IFestlegungskategoriestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.festlegungskategorierouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Festlegungskategorie PUT');

        const data = <IFestlegungskategoriestruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateFestlegungskategorie(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Beschreibung, data: data });
          }
          else {

            res.status(404).send({ message: 'Festlegungskategorie not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.festlegungskategorierouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Festlegungskategorie POST');

        const data = <IFestlegungskategoriestruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.AddFestlegungskategorie(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Beschreibung, data: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'FestlegungskategorieouterClass', 'SetRoutes');
    }
  }
}


