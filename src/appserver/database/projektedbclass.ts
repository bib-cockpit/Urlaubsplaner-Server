import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {IProjektestruktur, Projekteshema} from "../datenstrukturen/projektestruktur_server";

export class ProjekteDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadProjektliste(): Promise<any> {

    try {

      let ProjektmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IProjektestruktur[] = [];

      return new Promise((resolve, reject) => {

        ProjektmodelClass = model(this.Const.ProjektecollectionName, Projekteshema);

        ProjektmodelClass.find( { Deleted: false } ).sort({ Projektname: 1 }).then((data: any) => {

          data.forEach((projekt) => {

            Liste.push(projekt._doc);
          });

          resolve(Liste);

          console.log('');

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjekteDBClass', 'ReadStandortliste');
    }
  }

  public AddProjekt(data: IProjektestruktur):Promise<any> {

    try {

      let Projektmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Projektmodel = this.GetProjektModel(data);

        Projektmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjekteDBClass', 'AddProjekt');
    }
  }

  public UpdateProjekt(data: IProjektestruktur):Promise<any> {

    try {

      let ProjektmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        ProjektmodelClass = model(this.Const.ProjektecollectionName, Projekteshema);

        ProjektmodelClass.findById(data._id).then((projekt: mongoose.Document) => {

          if(projekt) {

            projekt.set(data);
            projekt.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'ProjekteDBClass', 'UpdateProjekt');
    }
  }

  public GetProjektModel(data: IProjektestruktur): mongoose.Document {

    try {

      const ProjektmodelClass = model(this.Const.ProjektecollectionName, Projekteshema);
      const Projektmodel: mongoose.Document = new ProjektmodelClass(data);

      return Projektmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ProjekteDBClass', 'GetProjektModel');
    }
  }
}
