import {Document, DocumentQuery, model, Model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import lodash from 'lodash';
import {IMitarbeiterstruktur, Mitarbeitershema} from "../datenstrukturen/mitarbeiterstruktur_server";

export class MitarbeiterDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadMitarbeiterliste(): Promise<any> {

    try {

      let MitarbeitermodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IMitarbeiterstruktur[] = [];

      this.Debug.ShowInfoMessage('ReadMitarbeiterliste', 'MitarbeiterDBClass', 'ReadMitarbeiterliste');

      return new Promise((resolve, reject) => {

        MitarbeitermodelClass = model(this.Const.MitarbeitercollectionName, Mitarbeitershema);

        MitarbeitermodelClass.find( { Deleted: false } ).sort({Name: 1}).then((data: any) => {

          this.Debug.ShowInfoMessage('Durchsuchen der Mitarbeiterliste wurde ausgeführt. ', 'MitarbeiterDBClass', 'ReadMitarbeiterliste');

          data.forEach((mitarbeiter) => {

            Liste.push(mitarbeiter._doc);
          });

          this.Debug.ShowInfoMessage(Liste.length + ' Mitarbeitereintraege vorhanden.', 'MitarbeiterDBClass', 'ReadMitarbeiterliste');

          resolve(Liste);


        }).catch((error: any) => {

          this.Debug.ShowErrorMessage('Fehler beim Lesen der Mitarbeiterliste', error, 'MitarbeiterDBClass', 'ReadMitarbeiterliste')

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeiterDBClass', 'ReadMitarbeiterliste');
    }
  }

  public ReadMitarbeiter(email: string): Promise<any> {

    try {

      let MitarbeitermodelClass: mongoose.Model<mongoose.Document>;
      let Mitarbeiter: IMitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        MitarbeitermodelClass = model(this.Const.MitarbeitercollectionName, Mitarbeitershema);

        MitarbeitermodelClass.findOne( { Email: email } ).then((data: any) => {

          Mitarbeiter = <IMitarbeiterstruktur>data;

          resolve(Mitarbeiter);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeiterDBClass', 'ReadMitarbeiter');
    }
  }

  public async AddMitarbeiter(data: IMitarbeiterstruktur):Promise<any> {

    try {

      let Mitarbeitermodel: mongoose.Document;
      let Mitarbeiterliste: IMitarbeiterstruktur[];
      let Check: IMitarbeiterstruktur;
      let Result: any;

      // return new Promise<any>((resolve, reject) => {

        delete data._id;

        try {

          Mitarbeiterliste = await this.ReadMitarbeiterliste();

        }
        catch(error: any) {

          return Promise.reject(error);
        }

        Check = lodash.find(Mitarbeiterliste, { UserID: data.UserID } );

        if(lodash.isUndefined(Check)) {

          try {

            Mitarbeitermodel = this.GetMitarbeiterModel(data);
            Result           = Mitarbeitermodel.save();

            return Promise.resolve(Result);

          } catch (error: any) {

            return Promise.reject(error);
          }
        }
        else {

          return Promise.resolve(Check);
        }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeiterDBClass', 'AddMitrabeiter');
    }
  }

  public UpdateMitarbeiter(data: IMitarbeiterstruktur):Promise<any> {

    try {

      let MitarbeitermodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        MitarbeitermodelClass = model(this.Const.MitarbeitercollectionName, Mitarbeitershema);

        MitarbeitermodelClass.findById(data._id).then((mitarbeiter: mongoose.Document) => {

          if(mitarbeiter) {

            mitarbeiter.set(data);
            mitarbeiter.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeiterDBClass', 'UpdateMitarbeiter');
    }
  }

  public GetMitarbeiterModel(data: IMitarbeiterstruktur): mongoose.Document {

    try {

      const MitarbeitermodelClass = model(this.Const.MitarbeitercollectionName, Mitarbeitershema);
      const Mitarbeitermodel: mongoose.Document = new MitarbeitermodelClass(data);

      return Mitarbeitermodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeiterDBClass', 'GetMitarbeiterModel');
    }
  }
}
