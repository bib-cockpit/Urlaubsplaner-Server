import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {IProtokollstruktur, Protokollshema} from "../datenstrukturen/protokollstruktur_server";
import {Projektpunktshema} from "../datenstrukturen/projektpunktestruktur_server";

export class ProtokollDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  // HEllo World

  public ReadProtkollliste(projektkey: string): Promise<any> {

    try {

      let ProtokollmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IProtokollstruktur[] = [];

      return new Promise((resolve, reject) => {

        ProtokollmodelClass = model(this.Const.ProtokollcollectionName, Protokollshema);

        ProtokollmodelClass.find( { Deleted: false, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((protokoll) => {

            Liste.push(protokoll._doc);
          });

          resolve(Liste);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollDBClass', 'ReadProtkollliste');
    }
  }

  public RemoveProtokoll(protokoll: IProtokollstruktur): Promise<any> {

    try {

      let ProtokollmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        ProtokollmodelClass = model(this.Const.ProtokollcollectionName, Protokollshema);

        ProtokollmodelClass.deleteOne({_id: protokoll._id}).then((result: any) => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollDBClass', 'RemoveProtokoll');
    }
  }

  public AddProtokoll(data: IProtokollstruktur):Promise<any> {

    try {

      let Protokollmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Protokollmodel = this.GetProtokollModel(data);

        Protokollmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollDBClass', 'AddProtokoll');
    }
  }

  public UpdateProtokoll(data: IProtokollstruktur):Promise<any> {

    try {

      let ProtokollmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        ProtokollmodelClass = model(this.Const.ProtokollcollectionName, Protokollshema);

        ProtokollmodelClass.findById(data._id).then((protkoll: mongoose.Document) => {

          if(protkoll) {

            protkoll.set(data);
            protkoll.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollDBClass', 'UpdateProtokoll');
    }
  }

  public GetProtokollModel(data: IProtokollstruktur): mongoose.Document {

    try {

      const ProtkollmodelClass = model(this.Const.ProtokollcollectionName, Protokollshema);
      const Protokollmodel: mongoose.Document = new ProtkollmodelClass(data);

      return Protokollmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProtokollDBClass', 'GetProtokollModel');
    }
  }
}
