import {connect, Mongoose} from "mongoose";
import {DebugClass} from "./debug";

export class ConnectionClass {

  private Debug: DebugClass;
  public Connection: any;
  public Connected: boolean;

  public readonly COSMOSDB_USER     = process.env.COSMOSDB_USER;
  public readonly COSMOSDB_PASSWORD = process.env.COSMOSDB_PASSWORD;
  public readonly COSMOSDB_DBNAME   = process.env.COSMOSDB_DBNAME;
  public readonly COSMOSDB_HOST     = process.env.COSMOSDB_HOST;
  public readonly COSMOSDB_PORT     = process.env.COSMOSDB_PORT;

  public ConnectOffline(): Promise<any> {

    try {

      let Uri: string = 'mongodb://localhost:27017/cockpitdb';

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

        let Uri: string = "mongodb://" + this.COSMOSDB_HOST + ":"+this.COSMOSDB_PORT + "/" + this.COSMOSDB_DBNAME + "?ssl=true&replicaSet=globaldb";

        this.Connection = connect(Uri, {
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

      this.Debug = new DebugClass();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConnectionClass', 'constructor', this.Debug.Typen.Class);
    }
  }
};

