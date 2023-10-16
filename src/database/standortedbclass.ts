import {Document, DocumentQuery, model, Model} from "mongoose";
import {IStandortestruktur, Standorteshema } from "../datenstrukturen/standortestruktur_server";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";

export class StandorteDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadStandortliste(): Promise<any> {

    try {

      let StandortmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IStandortestruktur[] = [];

      return new Promise((resolve, reject) => {

        StandortmodelClass = model(this.Const.StandortecollectionName, Standorteshema);

        StandortmodelClass.find( { Deleted: false } ).sort({Standort: 1}).then((data: any) => {

          data.forEach((standort) => {

            Liste.push(standort._doc);
          });

          resolve(Liste);

          console.log('');

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'StandorteDBClass', 'ReadStandortliste');
    }
  }

  public AddStandort(data: IStandortestruktur):Promise<any> {

    try {

      let Standortmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Standortmodel = this.GetStandortModel(data);

        Standortmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'StandorteDBClass', 'AddStandort');
    }
  }

  public UpdateStandort(data: IStandortestruktur):Promise<any> {

    try {

      let StandortmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        StandortmodelClass = model(this.Const.StandortecollectionName, Standorteshema);

        StandortmodelClass.findById(data._id).then((standort: mongoose.Document) => {

          if(standort) {

            standort.set(data);
            standort.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'StandorteDBClass', 'UpdateStandort');
    }
  }

  public GetStandortModel(data: IStandortestruktur): mongoose.Document {

    try {

      const StandortmodelClass = model(this.Const.StandortecollectionName, Standorteshema);
      const Standortmodel: mongoose.Document = new StandortmodelClass(data);

      return Standortmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'StandorteDBClass', 'GetStandortModel');
    }
  }
}
