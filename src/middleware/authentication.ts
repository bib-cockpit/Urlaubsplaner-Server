import {NextFunction, Request, Response} from "express";
import * as jwt from 'jsonwebtoken';
import {DebugClass} from "../debug";
import passport from 'passport';

export class AuthenticationClass {

  constructor() {

    try  {

    }
    catch(error) {

    }
  }

  public authenticate = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('oauth-bearer', {session: false }, (err, user, token) => {

      debugger;

      if(user !== false) {

        next();
      }
      else {

        debugger;

        res.status(401).send('User Unauthorized');
      }

    })(req, res, next);
  }

  public asyncMiddleware = fn =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    };

  public cors = (req: any, res: Response, next: NextFunction) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    next();
  }
}
