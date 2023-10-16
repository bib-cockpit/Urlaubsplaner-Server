import {Document, DocumentQuery, model, Model} from "mongoose";
import {IFestlegungskategoriestruktur, Festlegungskategorieshema } from "../datenstrukturen/Festlegungskategoriestruktur_server";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";

export class FestlegungskategorieDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadFestlegungskategorieliste(projektkey: string): Promise<any> {

    try {

      let FestlegungskategoriemodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IFestlegungskategoriestruktur[] = [];

      return new Promise((resolve, reject) => {

        FestlegungskategoriemodelClass = model(this.Const.FestlegungskategoriecollectionName, Festlegungskategorieshema);

        FestlegungskategoriemodelClass.find( { Deleted: false, Projektkey: projektkey } ).then((data: any) => {

          data.forEach((kategorie) => {

            Liste.push(kategorie._doc);
          });

          resolve(Liste);

          console.log('');

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'FestlegungskategorieDBClass', 'ReadFestlegungskategorieliste');
    }
  }

  public AddFestlegungskategorie(data: IFestlegungskategoriestruktur):Promise<any> {

    try {

      let Festlegungkategoriemodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Festlegungkategoriemodel = this.GetFestlegungskategorieModel(data);

        Festlegungkategoriemodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'FestlegungskategorieDBClass', 'AddFestlegungskategorie');
    }
  }

  public UpdateFestlegungskategorie(data: IFestlegungskategoriestruktur):Promise<any> {

    try {

      let FestlegungskategoriemodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        FestlegungskategoriemodelClass = model(this.Const.FestlegungskategoriecollectionName, Festlegungskategorieshema);

        FestlegungskategoriemodelClass.findById(data._id).then((kategorie: mongoose.Document) => {

          if(kategorie) {

            kategorie.set(data);
            kategorie.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'FestlegungskategorieDBClass', 'UpdateFestlegungskategorie');
    }
  }

  public GetFestlegungskategorieModel(data: IFestlegungskategoriestruktur): mongoose.Document {

    try {

      const FestlegungskategoriemodelClass = model(this.Const.FestlegungskategoriecollectionName, Festlegungskategorieshema);
      const Festlegungkategoriemodel: mongoose.Document = new FestlegungskategoriemodelClass(data);

      return Festlegungkategoriemodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'FestlegungskategorieDBClass', 'GetFestlegungskategorieModel');
    }
  }
}
