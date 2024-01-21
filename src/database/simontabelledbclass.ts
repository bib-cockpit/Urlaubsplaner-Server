import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {ISimontabellestruktur, Simontabelleshema} from "../datenstrukturen/simontabellestruktur_server";

export class SimontabelleDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadSimontabelleliste(projektkey: string): Promise<any> {

    try {

      let SimontabellemodelClass: mongoose.Model<mongoose.Document>;
      let Liste: ISimontabellestruktur[] = [];

      return new Promise((resolve, reject) => {

        SimontabellemodelClass = model(this.Const.SimontabellencollectionName, Simontabelleshema);

        SimontabellemodelClass.find( { Deleted: false, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((simontabelle) => {

            Liste.push(simontabelle._doc);
          });

          resolve(Liste);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleDBClass', 'ReadSimontabelleliste');
    }
  }

  public RemoveSimontabelle(simontabelle: ISimontabellestruktur): Promise<any> {

    try {

      let SimontabellemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        SimontabellemodelClass = model(this.Const.SimontabellencollectionName, Simontabelleshema);

        SimontabellemodelClass.deleteOne({_id: simontabelle._id}).then((result: any) => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleDBClass', 'RemoveSimontabelle');
    }
  }

  public AddSimontabelle(data: ISimontabellestruktur):Promise<any> {

    try {

      let Simontabellemodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Simontabellemodel = this.GetSimontabelleModel(data);

        Simontabellemodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleDBClass', 'AddSimontabelle');
    }
  }

  public UpdateSimontabelle(data: ISimontabellestruktur):Promise<any> {

    try {

      let SImontabellemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        SImontabellemodelClass = model(this.Const.SimontabellencollectionName, Simontabelleshema);

        SImontabellemodelClass.findById(data._id).then((simontabelle: mongoose.Document) => {

          if(simontabelle) {

            simontabelle.set(data);
            simontabelle.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleDBClass', 'UpdateSimontabelle');
    }
  }

  public GetSimontabelleModel(data: ISimontabellestruktur): mongoose.Document {

    try {

      const SimontabellemodelClass = model(this.Const.SimontabellencollectionName, Simontabelleshema);
      const Simontabellemodel: mongoose.Document = new SimontabellemodelClass(data);

      return Simontabellemodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'SimontabelleDBClass', 'GetSimontabelleModel');
    }
  }
}
