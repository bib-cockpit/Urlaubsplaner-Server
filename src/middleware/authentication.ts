import {NextFunction, Response} from "express";
import * as jwt from 'jsonwebtoken';
import {DebugClass} from "../debug";

export class AuthenticationClass {

  constructor() {

    try  {

    }
    catch(error) {

    }
  }

  check (req: any, res: Response, next: NextFunction) {

    const Debug: DebugClass   = new DebugClass();
    const token: string       = req.header('authorization');
    const key: string         = process.env.COCKPIT_JWTSecretKey;

    // Debug.ShowInfoMessage('Check Token: "' + token, 'Authentication', 'check');
    // Debug.ShowInfoMessage('Token Key:   "' + key,   'Authentication', 'check');

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
