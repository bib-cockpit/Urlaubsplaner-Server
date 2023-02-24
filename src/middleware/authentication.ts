import {NextFunction, Request, Response} from "express";
import * as jwt from 'jsonwebtoken';
import {DebugClass} from "../debug";
import {ConfigClass} from "../configclass";

export class AuthenticationClass {

  private Config: ConfigClass;

  constructor() {

    try  {

      this.Config = new ConfigClass();

    }
    catch(error) {


    }
  }

  check (req: any, res: Response, next: NextFunction) {

    const token: string     = req.header('authorization');
    const key: string       = this.Config.SecretKey;
    const Debug: DebugClass = new DebugClass();

    Debug.ShowInfoMessage('Check Token: "' + token, 'Authentication', 'check');
    Debug.ShowInfoMessage('Token Key:   "' + key,   'Authentication', 'check');

    if(!token) return res.status(401).send('Access denied. No token provided.');

    try {

      const decoded = jwt.verify(token, key);

      req.user = decoded;

      next();
    }
    catch(error) {

      res.status(400).send('Invalid token.');
    }
  }
}
