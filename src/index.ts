import * as dotenv from 'dotenv';

if(typeof process.env.NODE_ENV === 'undefined') {

  dotenv.config();
}

import express, {NextFunction, Request, Response} from "express";
import helmet from "helmet";
import morgan from "morgan";
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
import config from "config";
import {ConfigClass} from "./configclass";

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
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
const Config: ConfigClass = new ConfigClass();

/*
Config.Init(
  config.util.getEnv('NODE_ENV'),
  config.get('Statusmessage'),
  config.get('db_user'),
  config.get('db_password'),
  config.get('COSMOSDB_DBNAME'),
  config.get('COSMOSDB_HOST'),
  config.get('COSMOSDB_PORT'),
  config.get('secretkey')
);

Connection.Init(Config);
Homerouter.Init(Config);

 */

app.use(morgan('dev')); // http request Debug messages
app.use((req: Request, res: Response, next: NextFunction) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  next();
});

Homerouter.SetRoutes();
Standorterouter.SetRoutes();
Mitarbeiterouter.SetRoutes();
Settingsrouter.SetRoutes();
Registrierungrouter.SetRoutes();
Projekterouter.SetRoutes();
Projektpunkterouter.SetRoutes();
Protokollrouter.SetRoutes();

app.use(express.json()); // setze request.body JSON
app.use(express.urlencoded({extended: true}));
app.use(helmet());

app.use('/',              Homerouter.homerouter);
app.use('/standorte',     Standorterouter.standorterouter);
app.use('/mitarbeiter',   Mitarbeiterouter.mitarbeiterrouter);
app.use('/settings',      Settingsrouter.mitarbeitersettingrouter);
app.use('/registrierung', Registrierungrouter.registrierungrouter);
app.use('/projekte',      Projekterouter.projekterouter);
app.use('/projektpunkte', Projektpunkterouter.projektpunkterouter);
app.use('/protokolle',    Protokollrouter.protokolllerouter);

app.listen(port, () => {

  Debug.ShowInfoMessage(`Cockpit Server is listening on port ${port}.....`, 'index.ts', 'Server');
  Debug.ShowInfoMessage(`Startup time ${moment().format('HH:mm:ss')}`, 'index.ts', 'Server');

  /*

  if(process.env.NODE_ENV === 'production') {

      Connection.ConnectOnline().then(() => {

        Debug.ShowInfoMessage('Connected to Online Server MongoDB......', 'index.ts', 'Server');

      }).catch((error) => {

        Debug.ShowErrorMessage('Connection to Online Server MongoDB failed...', error, 'index.ts', 'Server');
      });

  } else {

    Connection.ConnectOffline().then(() => {

      Debug.ShowInfoMessage('Connected to Offline Server MongoDB......', 'index.ts', 'Server');

    }).catch((error) => {

      Debug.ShowErrorMessage('Connection to Offline Server MongoDB failed...', error, 'index.ts', 'Server');
    });
  }

   */
});











