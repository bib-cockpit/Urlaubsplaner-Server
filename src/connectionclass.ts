import {connect, Mongoose} from "mongoose";
import {DebugClass} from "./debug";
import {ConfigClass} from "./configclass";

export class ConnectionClass {

  private Debug: DebugClass;
  public Connection: any;
  public Connected: boolean;
  private Config: ConfigClass;

  Init(config: ConfigClass) {

    try {

      this.Config = config;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'Init', this.Debug.Typen.Class);
    }
  }

  public ConnectOffline(): Promise<any> {

    try {

      let Uri: string = 'mongodb://' + this.Config.COSMOSDB_HOST + ':' + this.Config.COSMOSDB_PORT + '/' + this.Config.COSMOSDB_DBNAME;

      this.Debug.ShowInfoMessage('Connection String Oflline: ' + Uri, 'ConnectionClass', 'ConnectOffline');


      return new Promise((resolve, reject) => {

        this.Connection = connect(Uri, {

          useNewUrlParser:    true,
          useUnifiedTopology: true

        }).then((data: Mongoose) => {

          this.Connected = true;

          resolve(true);

        }).catch((error) => {

          this.Connected  = false;
          this.Connection = null;

          console.log(error.message);

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'Connect', this.Debug.Typen.Class);
    }
  }

  public ConnectOnline(): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        let Parameter: string = "?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cockbit-cosmos-db@"
        let Uri: string = "mongodb://" + this.Config.COSMOSDB_HOST + ":"+this.Config.COSMOSDB_PORT + "/" + this.Config.COSMOSDB_DBNAME + Parameter;

        /*

        var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://cockpit-cosmos-db:t0ubgLQHQsFtsI9pzm1feNvJC72h6k0haZV5W5kWJOi0XCMmdoViASHA1PH77qLq2D1nhV7VewrTACDbeXMzaQ%3D%3D@cockpit-cosmos-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cockpit-cosmos-db@", function (err, client) {
  client.close();
});
         */

        this.Debug.ShowInfoMessage('Connection String Online: ' + Uri, 'ConnectionClass', 'ConnectOnline');

        this.Connection = connect(Uri, {
          auth: {

            user:     this.Config.COSMOSDB_USER,
            password: this.Config.COSMOSDB_PASSWORD,
          },
          useNewUrlParser:    true,
          useUnifiedTopology: true,

        }).then((data: Mongoose) => {

          this.Connected = true;

          resolve(true);

        }).catch((error) => {

          this.Connected  = false;
          this.Connection = null;

          console.log(error.message);

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'ConnectOnline', this.Debug.Typen.Class);
    }
  }

  constructor() {

    try {

      this.Debug = new DebugClass();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'constructor', this.Debug.Typen.Class);
    }
  }
};

