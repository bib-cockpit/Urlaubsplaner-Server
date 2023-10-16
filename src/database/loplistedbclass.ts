import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {ILOPListestruktur, LOPListeshema} from "../datenstrukturen/loplistestruktur_server";

export class LOPListeDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadLOPListe(projektkey: string): Promise<any> {

    try {

      let LOPListemodelClass: mongoose.Model<mongoose.Document>;
      let Liste: ILOPListestruktur[] = [];

      return new Promise((resolve, reject) => {

        LOPListemodelClass = model(this.Const.LOPListecollectionName, LOPListeshema);



        LOPListemodelClass.find( { Deleted: false,  Projektkey: projektkey } ).then((data: any) => {

          data.forEach((lopliste) => {

            Liste.push(lopliste._doc);
          });

          resolve(Liste);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'LOPListeDBClass', 'ReadProtkollliste');
    }
  }

  public AddLOPListe(data: ILOPListestruktur):Promise<any> {

    try {

      let LOPListemodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        LOPListemodel = this.GetLOPListeModel(data);

        LOPListemodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'LOPListeDBClass', 'AddLOPListe');
    }
  }

  public UpdateLOPListe(data: ILOPListestruktur):Promise<any> {

    try {

      let LOPListemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        LOPListemodelClass = model(this.Const.LOPListecollectionName, LOPListeshema);

        LOPListemodelClass.findById(data._id).then((lopliste: mongoose.Document) => {

          if(lopliste) {

            lopliste.set(data);
            lopliste.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'LOPListeDBClass', 'UpdateLOPListe');
    }
  }

  public GetLOPListeModel(data: ILOPListestruktur): mongoose.Document {

    try {

      const LOPListemodelClass = model(this.Const.LOPListecollectionName, LOPListeshema);
      const LOPListemodel: mongoose.Document = new LOPListemodelClass(data);

      return LOPListemodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'LOPListeDBClass', 'GetLOPListeModel');
    }
  }
}
