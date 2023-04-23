import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {ChangelogDBClass} from "../database/changelogdbclass";
import {IChangelogstruktur} from "../datenstrukturen/changelogstruktur_server";


class ChangelogrouterClass {

  private Debug: DebugClass;
  public  changelogrouter: any;
  private Database: ChangelogDBClass;

  constructor() {

    this.changelogrouter   = Router();
    this.Debug             = new DebugClass();
    this.Database          = new ChangelogDBClass();
  }


  SetRoutes() {

    try {

      // Chnagelogliste lesen

      let token: string;

      this.changelogrouter.get('/', (req: Request, res: Response) => {

        console.log('GET Changelogliste');

        this.Database.ReadChangelogliste().then((liste: IChangelogstruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          debugger;

          res.status(400).send(error.message);

        });


      });

      // POST ist für neuen Changelog

      this.changelogrouter.post('/', (req: Request, res: Response) => {

        console.log('Changelog POST');

        const Changelog = <IChangelogstruktur>req.body;

        delete Changelog._id;

        console.log('Daten: ' + JSON.stringify(Changelog));

        this.Database.AddChangelog(Changelog).then((result) => {

          res.status(200).send({ message: 'Added: ' + Changelog.Beschreibung, Changelog: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.changelogrouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Changelog PUT');

        const data = <IChangelogstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));



        this.Database.UpdateChangelog(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Beschreibung, Changelog: data });
          }
          else {

            res.status(404).send({ message: 'Changelog not found.', Changelog: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'ChangelogrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}


export { ChangelogrouterClass };

