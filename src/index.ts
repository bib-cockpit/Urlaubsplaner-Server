import * as dotenv from 'dotenv';
import passport from "passport";
import {BearerStrategy, IBearerStrategyOptionWithRequest, ITokenPayload, VerifyCallback} from "passport-azure-ad";

if(typeof process.env.NODE_ENV === 'undefined') {

  process.env.NODE_CONFIG_DIR = './config';

  console.log('NODE_ENV nicht definiert. Die Ersatzvariablen aus dotenv werden verwendet.');
  // Test

  dotenv.config();
}
else {

  console.log('NODE_ENV ist auf dem Server verfügbar: ' + process.env.NODE_ENV);
  process.env.NODE_CONFIG_DIR = './dist-server/src/config';
}

import express from "express";
import { HomerouterClass } from './routes/homeroutes';
import { StandorterouterClass } from './routes/standorterouts';
import { Application } from "express";
import {ConnectionClass} from "./connectionclass";
import moment from "moment";
import {DebugClass} from "./debug";
import {MitarbeiterrouterClass} from "./routes/mitarbeiterrouts";
import {RegistrierungrouterClass} from "./routes/registrierungrouts";
import {ProjekteroutsClass} from "./routes/projekterouts";
import {MitarbeitersettingsrouterClass} from "./routes/mitarbeitersettingrouts";
import {ProjektpunkteroutsClass} from "./routes/projektpunkteerouts";
import {ProtokolleroutsClass} from "./routes/protokollerouts";
import {ChangelogrouterClass} from "./routes/changelogrouts";
import config from "config";
import {ConfigClass} from "./configclass";
import {AuthenticationClass} from "./middleware/authentication";
import {ErrorrouterClass} from "./routes/errorroutes";
import helmet from "helmet";

const app: Application = express();
const Connection: ConnectionClass = new ConnectionClass();
const Homerouter: HomerouterClass = new HomerouterClass();
const Mitarbeiterouter: MitarbeiterrouterClass = new MitarbeiterrouterClass();
const Debug: DebugClass = new DebugClass();
const Standorterouter: StandorterouterClass = new StandorterouterClass();
const Registrierungrouter: RegistrierungrouterClass = new RegistrierungrouterClass();
const Projekterouter: ProjekteroutsClass = new ProjekteroutsClass();
const Settingsrouter: MitarbeitersettingsrouterClass = new MitarbeitersettingsrouterClass();
const Projektpunkterouter: ProjektpunkteroutsClass = new ProjektpunkteroutsClass();
const Protokollrouter: ProtokolleroutsClass = new ProtokolleroutsClass();
const Changelogrouter: ChangelogrouterClass = new ChangelogrouterClass();
const Errorrouter: ErrorrouterClass = new ErrorrouterClass();
const Config: ConfigClass = new ConfigClass();
const Auth: AuthenticationClass = new AuthenticationClass();

let Port: string           = 'none';
let NODE_ENV: string       = config.has('node_env')         ? config.get('node_env')              : 'nicht definiert';
let Statausmessage: string = config.has('Statusmessage')    ? config.get('Statusmessage')         : 'nicht definiert';
let User : string          = config.has('db_user')          ? config.get('db_user')               : 'nicht definiert';
let Passwort: string       = config.has('db_password')      ? config.get('db_password')           : 'nicht definiert';
let DBName: string         = config.has('COSMOSDB_DBNAME')  ? config.get('COSMOSDB_DBNAME')       : 'nicht definiert';
let DBHost: string         = config.has('COSMOSDB_HOST')    ? config.get('COSMOSDB_HOST')         : 'nicht definiert';
let DBPort: string         = config.has('COSMOSDB_PORT')    ? config.get('COSMOSDB_PORT')         : 'nicht definiert';
let Tenant_ID: string      = config.has('tenant_id')        ? config.get('tenant_id')             : 'nicht definiert';
let Server_App_ID: string  = config.has('server_app_id')    ? config.get('server_app_id')         : 'nicht definiert';

Config.Init(
  NODE_ENV,
  Port,
  Statausmessage,
  User,
  Passwort,
  DBName,
  DBHost,
  DBPort,
  Tenant_ID,
  Server_App_ID
);

const version = 'v2.0';

const options: IBearerStrategyOptionWithRequest =  {

  identityMetadata:`https://login.microsoftonline.com/${Tenant_ID}/${version}/.well-known/openid-configuration`,
  clientID: Server_App_ID,
  loggingLevel: "info", // 'info', 'warn','error'.
  passReqToCallback: false, // auf false lassen sonst done function in BearerStrategy undefined
  isB2C:false,
  validateIssuer:false,
  loggingNoPII: true, // true === no personal informtions like token is logged
  scope: ["database_access"]
};

app.use(Auth.cors);
app.use(passport.initialize());
passport.use(new BearerStrategy(options, function(token: ITokenPayload, done: VerifyCallback) {

  let user: any;
  let error: any;

  if(token) {

    user  = { username: token.preferred_username };
    error = null;
  }
  else {

    user  = false;
    error = 'no user';
  }

  done(error, user, token);
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

Connection.Init(Config);
Homerouter.Init(Config);

Homerouter.SetRoutes();
Errorrouter.SetRoutes();
Standorterouter.SetRoutes();
Mitarbeiterouter.SetRoutes();
Settingsrouter.SetRoutes();
Registrierungrouter.SetRoutes();
Projekterouter.SetRoutes();
Projektpunkterouter.SetRoutes();
Protokollrouter.SetRoutes();
Changelogrouter.SetRoutes();

app.use('/',              Homerouter.homerouter);
app.use('/error',         Errorrouter.errorrouter);
app.use('/standorte',     Standorterouter.standorterouter);
app.use('/mitarbeiter',   Mitarbeiterouter.mitarbeiterrouter);
app.use('/settings',      Settingsrouter.mitarbeitersettingrouter);
app.use('/registrierung', Registrierungrouter.registrierungrouter);
app.use('/projekte',      Projekterouter.projekterouter);
app.use('/projektpunkte', Projektpunkterouter.projektpunkterouter);
app.use('/protokolle',    Protokollrouter.protokolllerouter);
app.use('/changelog',     Changelogrouter.changelogrouter);

let server = app.listen(8080, () =>  {

  let address: any = server.address();

  Config.PORT = address.port;

  Debug.ShowInfoMessage(`Cockpit Server is listening on port ${Config.PORT}.....`, 'index.ts', 'Server');
  Debug.ShowInfoMessage('Address: ' + address['address'], 'index.ts', 'Server');
  Debug.ShowInfoMessage('Family:  ' + address['family'],  'index.ts', 'Server');
  Debug.ShowInfoMessage(`Startup time ${moment().format('HH:mm:ss')}`, 'index.ts', 'Server');

  if(Config.NODE_ENV === 'production') {

      Connection.ConnectOnline().then(() => {

        Debug.ShowInfoMessage('Connected to Online Mongo Database......', 'index.ts', 'Server');

      }).catch((error) => {

        Debug.ShowErrorMessage('Connection to Online Mongo Database failed...', error, 'index.ts', 'Server');
      });

  } else {

    Connection.ConnectOffline().then(() => {

      Debug.ShowInfoMessage('Connected to Offline Mongo Database......', 'index.ts', 'Server');

    }).catch((error) => {

      Debug.ShowErrorMessage('Connection to Offline Mongo Dataabase failed...', error, 'index.ts', 'Server');
    });
  }
});











