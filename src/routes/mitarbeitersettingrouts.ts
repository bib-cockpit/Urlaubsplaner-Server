import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {MitarbeitersettingsDBClass} from "../database/mitarbeitersettingsdbclass";
import {IMitarbeitersettingsstruktur} from "../datenstrukturen/mitarbeitersettingsstruktur_server";

class MitarbeitersettingsrouterClass {

  private Debug: DebugClass;
  public  mitarbeitersettingrouter: any;
  private Database: MitarbeitersettingsDBClass;

  constructor() {

    this.mitarbeitersettingrouter = Router();
    this.Debug                    = new DebugClass();
    this.Database                 = new MitarbeitersettingsDBClass();
  }


  SetRoutes() {

    try {

      // Mitarbeiterliste lesen

      let token: string;

      this.mitarbeitersettingrouter.get('/', (req: Request, res: Response) => {

          this.Database.ReadMitarbeitersettingsliste().then((liste: IMitarbeitersettingsstruktur[]) => {


            res.status(200).send(liste);

          }).catch((error) => {

            res.status(400).send(error.message);

          });


      });

      // POST ist für neuen Mitarbeiter

      this.mitarbeitersettingrouter.post('/', (req: Request, res: Response) => {

        console.log('Mitarbeitersettings POST');

        const Setting = <IMitarbeitersettingsstruktur>req.body;

        delete Setting._id;

        console.log('Daten: ' + JSON.stringify(Setting));

        this.Database.AddMitarbeitersetting(Setting).then((result) => {

          res.status(200).send({ message: 'Added: ' + Setting.MitarbeiterID, Settings: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.mitarbeitersettingrouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Mitarbeitersetting PUT');

        const data = <IMitarbeitersettingsstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateMitarbeitersetting(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.MitarbeiterID, Settings: data });
          }
          else {

            res.status(404).send({ message: 'Mitarbeitersetting not found.', Settings: null });
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


export { MitarbeitersettingsrouterClass };

