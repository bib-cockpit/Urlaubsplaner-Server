import {Document, DocumentQuery, model, Model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {Bautagebuchshema, IBautagebuchstruktur} from "../datenstrukturen/bautagebuchstruktur_server";

export class BautagebuchDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public Readbautagebuchliste(projektkey: string): Promise<any> {

    try {

      let BautagebuchmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IBautagebuchstruktur[] = [];

      return new Promise((resolve, reject) => {

        BautagebuchmodelClass = model(this.Const.BautagebuchecollectionName, Bautagebuchshema);

        BautagebuchmodelClass.find( { Deleted: false, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((Bautagebuch) => {

            Liste.push(Bautagebuch._doc);
          });

          resolve(Liste);

          console.log('');

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'BautagebucheDBClass', 'ReadBautagebuchliste');
    }
  }

  public AddBautagebuch(data: IBautagebuchstruktur):Promise<any> {

    try {

      let Bautagebuchmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Bautagebuchmodel = this.GetBautagebuchModel(data);

        Bautagebuchmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'BautagebucheDBClass', 'AddBautagebuch');
    }
  }

  public UpdateBautagebuch(data: IBautagebuchstruktur):Promise<any> {

    try {

      let BautagebuchmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        BautagebuchmodelClass = model(this.Const.BautagebuchecollectionName, Bautagebuchshema);

        BautagebuchmodelClass.findById(data._id).then((Bautagebuch: mongoose.Document) => {

          if(Bautagebuch) {

            Bautagebuch.set(data);
            Bautagebuch.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'BautagebucheDBClass', 'UpdateBautagebuch');
    }
  }

  public GetBautagebuchModel(data: IBautagebuchstruktur): mongoose.Document {

    try {

      const BautagebuchmodelClass = model(this.Const.BautagebuchecollectionName, Bautagebuchshema);
      const Bautagebuchmodel: mongoose.Document = new BautagebuchmodelClass(data);

      return Bautagebuchmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'BautagebucheDBClass', 'GetBautagebuchModel');
    }
  }
}
