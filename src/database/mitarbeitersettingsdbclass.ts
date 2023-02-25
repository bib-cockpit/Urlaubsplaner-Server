import {Document, model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import { IMitarbeitersettingsstruktur, Mitarbeitersettingsshema } from "../datenstrukturen/mitarbeitersettingsstruktur_server";

export class MitarbeitersettingsDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadMitarbeitersettingsliste(): Promise<any> {

    try {

      let SettingsmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IMitarbeitersettingsstruktur[] = [];

      return new Promise((resolve, reject) => {

        SettingsmodelClass = model(this.Const.SettingscollectionName, Mitarbeitersettingsshema);

        SettingsmodelClass.find( { Deleted: false } ).then((data: any) => {

          data.forEach((setting) => {

            Liste.push(setting._doc);
          });

          resolve(Liste);

          console.log('');

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeitersettingsDBClass', 'ReadMitarbeiterliste');
    }
  }


  public AddMitarbeitersetting(data: IMitarbeitersettingsstruktur):Promise<any> {

    try {

      let Mitarbeitermodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        this.Debug.ShowInfoMessage('Funktion AddMitarbeitersetting -> Settingsmodel erzeugen', 'MitarbeitersettingsDBClass', 'AddMitarbeitersetting');

        Mitarbeitermodel = this.GetMitarbeitersettingModel(data);

        Mitarbeitermodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          this.Debug.ShowErrorMessage('Fehler beim erstellen der Mitarbeitersettings', error, 'AddMitarbeitersetting', 'AddMitarbeitersetting');

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeitersettingsDBClass', 'AddMitrabeiter');
    }
  }

  public UpdateMitarbeitersetting(data: IMitarbeitersettingsstruktur):Promise<any> {

    try {

      let SettingmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        SettingmodelClass = model(this.Const.SettingscollectionName, Mitarbeitersettingsshema);

        SettingmodelClass.findById(data._id).then((setting: mongoose.Document) => {

          if(setting) {

            setting.set(data);
            setting.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeitersettingsDBClass', 'UpdateMitarbeiter');
    }
  }

  public GetMitarbeitersettingModel(data: IMitarbeitersettingsstruktur): mongoose.Document {

    try {

      const SettingsmodelClass = model(this.Const.SettingscollectionName, Mitarbeitersettingsshema);
      const Settingsmodel: mongoose.Document = new SettingsmodelClass(data);

      return Settingsmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'MitarbeitersettingsDBClass', 'GetMitarbeiterModel');
    }
  }
}
