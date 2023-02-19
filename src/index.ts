
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
// import config from "config";
import {RegistrierungrouterClass} from "./routes/registrierungrouts";
import {ProjekteroutsClass} from "./routes/projekterouts";
import {MitarbeitersettingsrouterClass} from "./routes/mitarbeitersettingrouts";
import {ProjektpunkteroutsClass} from "./routes/projektpunkteerouts";
import {ProtokolleroutsClass} from "./routes/protokollerouts";

const app: Application = express();
const Environment = app.get('env');
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

/*
if(!config.has('COCKPIT_JWTSecretKey')) {

  // Debug.ShowErrorMessage('ERROR: COCKPIT_JWTSecretKey nicht definiert.', null, 'index.ts', 'Server');
  // process.exit(1);

  Debug.ShowInfoMessage('ERROR: COCKPIT_JWTSecretKey nicht definiert.', 'index.ts', 'Server');
}
else {

  Debug.ShowInfoMessage('COCKPIT_JWTSecretKey: ' + config.get('COCKPIT_JWTSecretKey'), 'index.ts', 'Server');
}

 */

app.use(morgan('dev')); // http request Debug messages
app.use((req: Request, res: Response, next: NextFunction) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  next();
});

Homerouter.SetRoutes(Environment);
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

  Connection.ConnectOnline().then(() => {

    Debug.ShowInfoMessage('Connected to MongoDB......', 'index.ts', 'Server');

  }).catch((error) => {

    Debug.ShowErrorMessage('Connection to MongoDB failed...', error, 'index.ts', 'Server');
  });
});











