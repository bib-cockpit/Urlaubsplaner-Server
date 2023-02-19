import {Request, Response, Router} from 'express';
import * as lodash from 'lodash-es';
import {StandorteDBClass} from "../database/standortedbclass";
import moment, {Moment} from "moment";
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IStandortestruktur} from "../datenstrukturen/standortestruktur_server";

export class StandorterouterClass {

  public  standorterouter: any;
  private Debug: DebugClass;
  private Database: StandorteDBClass;
  private Authentication: AuthenticationClass;

  constructor() {


    this.Debug           = new DebugClass();
    this.Database        = new StandorteDBClass();
    this.standorterouter = Router();
    this.Authentication  = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      this.standorterouter.get('/',  (req: Request, res: Response) => { // this.Authentication.check,

        // this.Debug.ShowInfoMessage('Headers: ' + JSON.stringify(req.headers), 'StandorterouterClass', 'SetRoutes');

        this.Database.ReadStandortliste().then((liste: IStandortestruktur[]) => {

          res.status(200).send(liste);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      this.standorterouter.put('/', (req: Request, res: Response) => {

        // PUT ist für Update

        console.log('Standorte PUT');

        const data = <IStandortestruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateStandort(data).then((result) => {

          if(result !== null) {

            res.status(200).send({ message: 'Saved: ' + data.Standort, data: data });
          }
          else {

            res.status(404).send({ message: 'Standort not found.', data: null });
          }

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

      this.standorterouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Standorte POST');

        const data = <IStandortestruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.AddStandort(data).then((result) => {

          res.status(200).send({ message: 'Added: ' + data.Standort, data: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'StandorterouterClass', 'SetRoutes');
    }
  }
}

/*
const Database: StandorteDBClass = new StandorteDBClass();



standorterouter.get('/:id', (req: Request, res: Response) => {

  Standorteliste = [];

  const id     = req.params.id;
  const course = lodash.find(Standorteliste, {id: parseInt(id)});

  if(lodash.isUndefined(course) === false) {

    // 200 OK

    res.status(200).send(course);
  }
  else {

    // 404 not found

    res.status(404).send({message: 'Kurs nicht gefunden'});
  }
});

standorterouter.post('/', (req: Request, res: Response) => {

  let Standort: any = req.body;

    Standorteliste.push(Standort);

    res.status(201).send(Standort);
});

standorterouter.put('/:id', (req: Request, res) => {

  const id = req.params.id;
  let Standort: any = <any>lodash.find(Standorteliste, {id: parseInt(id)});

  if(lodash.isUndefined(Standort) === false) {

    res.status(200).send(Standort);

  }
  else {

    // 404 not found

    res.status(404).send({ message: 'Standort nicht gefunden'});
  }
});

standorterouter.delete('/:id', (req: Request, res: Response) => {

  const     id = req.params.id;
  const Standort: any = <any>lodash.find(Standorteliste, {id: parseInt(id)});

  if(lodash.isUndefined(Standort) === false) return res.status(200).send(Standort);
  else                                       return res.status(404).send({ message: 'Standort nicht gefunden' });

});

 */

