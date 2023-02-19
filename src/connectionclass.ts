import {connect, Mongoose} from "mongoose";
import {DebugClass} from "./debug";

export class ConnectionClass {

  private Debug: DebugClass;
  public Connection: any;
  public Connected: boolean;
  private Connectionstring: string = '';
  public readonly COSMOSDB_USER     = process.env.COSMOSDB_USER;
  public readonly COSMOSDB_PASSWORD = process.env.COSMOSDB_PASSWORD;

  public Connect(): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        this.Connection = connect(this.Connectionstring, {
          useNewUrlParser: true,
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

             //  "cockbit-cosmos-db";
        // "S5eYqFWE5F2ZuzZBojFU3Nv11BcXAcGRBXlIuAaEGpCms7bTxkaMGIExMJOgARbTjgVM6PaQP73oACDbTyOG4A==";
        const COSMOSDB_DBNAME   = "cockbit-cosmos-db";
        const COSMOSDB_HOST     = "cockbit-cosmos-db.mongo.cosmos.azure.com";
        const COSMOSDB_PORT     = 10255;

        let uri = "mongodb://"+COSMOSDB_HOST+":"+COSMOSDB_PORT+"/"+COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb";

        this.Connection = connect(uri, {
          auth: {

            user:     this.COSMOSDB_USER,
            password: this.COSMOSDB_PASSWORD,
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

      this.Connectionstring = 'mongodb://localhost:27017/cockpitdb';

      this.Debug = new DebugClass();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'constructor', this.Debug.Typen.Class);
    }
  }
};

