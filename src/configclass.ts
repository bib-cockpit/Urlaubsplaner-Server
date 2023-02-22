import {DebugClass} from "./debug";


export class ConfigClass {

  private Debug: DebugClass;

  public COSMOSDB_USER;
  public COSMOSDB_PASSWORD;
  public COSMOSDB_DBNAME;
  public COSMOSDB_HOST;
  public COSMOSDB_PORT;
  public SecretKey;
  public NODE_ENV;
  public Statusmessage;

  constructor() {

    try {

    this.COSMOSDB_USER      = 'nouser';
    this.COSMOSDB_PASSWORD  = 'nopasswort';
    this.COSMOSDB_DBNAME    = 'nodbname';
    this.COSMOSDB_HOST      = 'nohost';
    this.COSMOSDB_PORT      = 0;
    this.SecretKey          = 'nokey';
    this.NODE_ENV           = 'none';
    this.Statusmessage      = 'Config not Init()';

      this.Debug = new DebugClass();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConfigClass', 'constructor', this.Debug.Typen.Class);
    }
  }

  public Init(nodeenv: string, status: string, dbuser: string, dbpass: string, dbname: string, dbhost: string, dbport: string, secretkey: string) {

    try {

      this.Debug = new DebugClass();

      this.NODE_ENV          = nodeenv;
      this.Statusmessage     = status;
      this.COSMOSDB_USER     = dbuser;
      this.COSMOSDB_PASSWORD = dbpass;
      this.COSMOSDB_DBNAME   = dbname;
      this.COSMOSDB_HOST     = dbhost;
      this.COSMOSDB_PORT     = dbport;
      this.SecretKey         = secretkey;


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConfigClass', 'Init', this.Debug.Typen.Class);
    }
  }
};

