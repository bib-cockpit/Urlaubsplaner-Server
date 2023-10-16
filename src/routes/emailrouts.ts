import {Request, Response, Router} from 'express';
import {DebugClass} from "../debug";
import {AuthenticationClass} from "../middleware/authentication";
import {IOutlookemailstruktur} from "../datenstrukturen/outlookemailstruktur_server";
import {Outlookemaildbclass} from "../database/outlookemaildbclass";
import {IProjektpunktestruktur} from "../datenstrukturen/projektpunktestruktur_server";

export class EmailrouterClass {

  public  emailrouter: any;
  private Debug: DebugClass;
  private Database: Outlookemaildbclass;
  private Authentication: AuthenticationClass;

  constructor() {

    this.Debug           = new DebugClass();
    this.Database        = new Outlookemaildbclass();
    this.emailrouter     = Router();
    this.Authentication  = new AuthenticationClass();
  }

  public SetRoutes() {

    try {

      let EmailID: string;

      this.emailrouter.get('/',  this.Authentication.authenticate,  (req: Request, res: Response) => {

        EmailID = <string>req.query.EmailID;

        this.Database.ReadEmail(EmailID).then((email: IOutlookemailstruktur) => {

          res.status(200).send(email);

        }).catch((error) => {

          res.status(400).send(error.message);

        });
      });

      // PUT ist für Update

      this.emailrouter.put('/', (req: Request, res: Response) => {

        console.log('Email PUT');

        const data = <IOutlookemailstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.UpdateEmail(data).then((result) => {

        if(result !== null) {

          res.status(200).send({ message: 'Saved: ' + data.subject, Email: data });
        }
        else {

          res.status(404).send({ message: 'Email not found.', data: null });
        }

      }).catch((error) => {

        res.status(400).send({ message: error.message });
      });
    });

      this.emailrouter.post('/', (req: Request, res: Response) => {

        // POST ist für neuen Eintrag

        console.log('Email POST');

        const data = <IOutlookemailstruktur>req.body;

        console.log('Daten: ' + JSON.stringify(data));

        this.Database.AddEmail(data).then((result) => {

          res.status(200).send({ message: 'Added Message: ' + data.subject , data: result._doc });

        }).catch((error) => {

          res.status(400).send({ message: error.message });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'emailrouterClass', 'SetRoutes');
    }
  }
}


