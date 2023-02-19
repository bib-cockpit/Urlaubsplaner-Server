import config from "config";

export class Configclass {

  public AppStatevarianten = {

    development : 'development',
    production:  'production'
  }

  constructor() {

  }

  public getAppState(): string {

    if(config.has('NODE_ENV')) return config.get('NODE_ENV');
    else return null;
  }

  public getJWTSecretKey(): string {

    if(config.has('COCKPIT_JWTSecretKey')) return config.get('COCKPIT_JWTSecretKey');
    else return null;
  }

  public get(keyname: string): string {

    try {

      if(config.has(keyname)) return config.get(keyname);
      else return null;
    }
    catch (error: any) {

    }
  }
};
