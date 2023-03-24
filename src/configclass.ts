import {DebugClass} from "./debug";

export class ConfigClass {

  private Debug: DebugClass;

  public COSMOSDB_USER;
  public COSMOSDB_PASSWORD;
  public COSMOSDB_DBNAME;
  public COSMOSDB_HOST;
  public COSMOSDB_PORT;
  public NODE_ENV;
  public PORT;
  public Statusmessage;
  public SERVER_APPLICATION_ID;
  public TENANT_ID;

  constructor() {

    try {

    this.COSMOSDB_USER         = 'nouser';
    this.COSMOSDB_PASSWORD     = 'nopasswort';
    this.COSMOSDB_DBNAME       = 'nodbname';
    this.COSMOSDB_HOST         = 'nohost';
    this.COSMOSDB_PORT         = '0';
    this.PORT                  = '5000';
    this.NODE_ENV              = 'none';
    this.Statusmessage         = 'Config not Init()';
    this.SERVER_APPLICATION_ID = 'none';
    this.TENANT_ID             = 'none';

      this.Debug = new DebugClass();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConfigClass', 'constructor', this.Debug.Typen.Class);
    }
  }

  public Init(nodeenv: string, port: string, status: string, dbuser: string, dbpass: string, dbname: string, dbhost: string, dbport: string, tenantid: string, server_app_id: string) {

    try {

      this.Debug = new DebugClass();

      this.NODE_ENV              = nodeenv;
      this.PORT                  = port;
      this.Statusmessage         = status;
      this.COSMOSDB_USER         = dbuser;
      this.COSMOSDB_PASSWORD     = dbpass;
      this.COSMOSDB_DBNAME       = dbname;
      this.COSMOSDB_HOST         = dbhost;
      this.COSMOSDB_PORT         = dbport;
      this.SERVER_APPLICATION_ID = server_app_id;
      this.TENANT_ID             = tenantid;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'ConfigClass', 'Init', this.Debug.Typen.Class);
    }
  }
};

