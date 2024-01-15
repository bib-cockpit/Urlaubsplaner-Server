import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {IProjektpunktestruktur, Projektpunktshema} from "../datenstrukturen/projektpunktestruktur_server";

export class ProjektpunkteDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadProjektpunkteliste(projektkey: string, deleted: boolean): Promise<any> {

    try {

      let ProjektpunktemodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IProjektpunktestruktur[] = [];

      return new Promise((resolve, reject) => {

        ProjektpunktemodelClass = model(this.Const.ProjektpunktecollectionName, Projektpunktshema);

        ProjektpunktemodelClass.find( { Deleted: deleted, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((projektpunkt) => {

            Liste.push(projektpunkt._doc);
          });

          resolve(Liste);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteDBClass', 'ReadProjektpunkteliste');
    }
  }

  public RemovePunkteliste(IDListe: string[]): Promise<any> {

    try {

      let ProjektpunktemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise((resolve, reject) => {

        ProjektpunktemodelClass = model(this.Const.ProjektpunktecollectionName, Projektpunktshema);

        ProjektpunktemodelClass.deleteMany({_id: {$in: IDListe}}).then(() => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteDBClass', 'RemovePunkteliste');
    }
  }

  public AddProjektpunkt(data: IProjektpunktestruktur):Promise<any> {

    try {

      let Projektpunktmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Projektpunktmodel = this.GetProjektpunkteModel(data);

        Projektpunktmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteDBClass', 'AddProjektpunkt');
    }
  }

  public UpdateProjektpunkt(data: IProjektpunktestruktur):Promise<any> {

    try {

      let ProjektpunktemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        ProjektpunktemodelClass = model(this.Const.ProjektpunktecollectionName, Projektpunktshema);

        ProjektpunktemodelClass.findById(data._id).then((projektpunkt: mongoose.Document) => {

          if(projektpunkt) {

            projektpunkt.set(data);
            projektpunkt.save().then((result: Document) => {

              resolve(result);

            }).catch((error) => {

              reject(error);
            });
          }
          else {

            resolve(null);
          }
        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteDBClass', 'UpdateProjektpunkt');
    }
  }

  public GetProjektpunkteModel(data: IProjektpunktestruktur): mongoose.Document {

    try {

      const ProjektpunktemodelClass = model(this.Const.ProjektpunktecollectionName, Projektpunktshema);
      const Projektpunktmodel: mongoose.Document = new ProjektpunktemodelClass(data);

      return Projektpunktmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjektpunkteDBClass', 'GetProjektpunkteModel');
    }
  }
}
