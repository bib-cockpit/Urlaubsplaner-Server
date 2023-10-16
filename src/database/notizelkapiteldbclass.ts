import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {INotizenkapitelstruktur, Notizenkapitelshema} from "../datenstrukturen/notizenkapitelstruktur_server";

export class NotizenkapitelDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadNotizenkapitelliste(projektkey: string): Promise<any> {

    try {

      let NotizenkapitelmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: INotizenkapitelstruktur[] = [];

      return new Promise((resolve, reject) => {

        NotizenkapitelmodelClass = model(this.Const.NotizenkapitelcollectionName, Notizenkapitelshema);

        NotizenkapitelmodelClass.find( { Deleted: false, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((notizenkapitel) => {

            Liste.push(notizenkapitel._doc);
          });

          resolve(Liste);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'NotizenkapitelDBClass', 'ReadNotizenkapitelliste');
    }
  }

  public AddNotizenkapitel(data: INotizenkapitelstruktur):Promise<any> {

    try {

      let Notizelkapitelmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Notizelkapitelmodel = this.GetNotizenkapitelModel(data);

        Notizelkapitelmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'AddNotizenkapitel', 'AddNotizenkapitel');
    }
  }

  public UpdateNotizenkapitel(data: INotizenkapitelstruktur):Promise<any> {

    try {

      let NotizenkapitelmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        NotizenkapitelmodelClass = model(this.Const.NotizenkapitelcollectionName, Notizenkapitelshema);

        NotizenkapitelmodelClass.findById(data._id).then((notizkapitel: mongoose.Document) => {

          if(notizkapitel) {

            notizkapitel.set(data);
            notizkapitel.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'NotizenkapitelDBClass', 'UpdateNotizenkapitel');
    }
  }

  public GetNotizenkapitelModel(data: INotizenkapitelstruktur): mongoose.Document {

    try {

      const NotizenkapitelmodelClass = model(this.Const.NotizenkapitelcollectionName, Notizenkapitelshema);
      const Notizenkapitelmodel: mongoose.Document = new NotizenkapitelmodelClass(data);

      return Notizenkapitelmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'NotizenkapitelDBClass', 'GetNotizenkapitelModel');
    }
  }
}
