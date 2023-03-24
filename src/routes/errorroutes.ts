import {NextFunction, Request, Response, Router} from 'express';
import {DebugClass} from "../debug";

class ErrorrouterClass {

  public  errorrouter: Router;
  private Debug:  DebugClass;

  constructor() {

    this.errorrouter = Router();
    this.Debug       = new DebugClass();
  }

  SetRoutes() {

    try {

      this.errorrouter.get('/',(req: Request, res: Response, next: NextFunction) => {

        debugger;

        res.status(500).send({Status: 'Server Error.'});
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'ErrorrouterClass', 'SetRoutes', this.Debug.Typen.Class);
    }
  }
}


export { ErrorrouterClass };

