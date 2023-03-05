import {Document, DocumentQuery, model, Model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {IChangelogstruktur, Changelogshema} from "../datenstrukturen/changelogstruktur_server";

export class ChangelogDBClass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadChangelogliste(): Promise<any> {

    try {

      let ChangelogmodelClass: mongoose.Model<mongoose.Document>;
      let Liste: IChangelogstruktur[] = [];

      this.Debug.ShowInfoMessage('ReadChangelogliste', 'ChangelogDBClass', 'ReadChangelogliste');

      return new Promise((resolve, reject) => {

        ChangelogmodelClass = model(this.Const.ChangelogcollectionName, Changelogshema);

        ChangelogmodelClass.find( { Deleted: false } ).sort({Name: 1}).then((data: any) => {

          this.Debug.ShowInfoMessage('Durchsuchen der Changelogliste wurde ausgeführt. ', 'ChangelogDBClass', 'ReadChangelogliste');

          data.forEach((changelog) => {

            Liste.push(changelog._doc);
          });

          this.Debug.ShowInfoMessage(Liste.length + ' Changelogeintraege vorhanden.', 'ChangelogDBClass', 'ReadChangelogliste');

          resolve(Liste);


        }).catch((error: any) => {

          this.Debug.ShowErrorMessage('Fehler beim Lesen der Changelogliste', error, 'ChangelogDBClass', 'ReadChangelogliste')

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ChangelogDBClass', 'ReadChangelogliste');
    }
  }

  public ReadChangelog(email: string): Promise<any> {

    try {

      let ChangelogmodelClass: mongoose.Model<mongoose.Document>;
      let Changelog: IChangelogstruktur;

      return new Promise((resolve, reject) => {

        ChangelogmodelClass = model(this.Const.ChangelogcollectionName, Changelogshema);

        ChangelogmodelClass.findOne( { Email: email } ).then((data: any) => {

          Changelog = <IChangelogstruktur>data;

          resolve(Changelog);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ChangelogDBClass', 'ReadChangelog');
    }
  }

  public AddChangelog(data: IChangelogstruktur):Promise<any> {

    try {

      let Changelogmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Changelogmodel = this.GetChangelogModel(data);

        Changelogmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ChangelogDBClass', 'AddMitrabeiter');
    }
  }

  public UpdateChangelog(data: IChangelogstruktur):Promise<any> {

    try {

      let ChangelogmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        ChangelogmodelClass = model(this.Const.ChangelogcollectionName, Changelogshema);

        ChangelogmodelClass.findById(data._id).then((changelog: mongoose.Document) => {

          if(changelog) {

            changelog.set(data);
            changelog.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'ChangelogDBClass', 'UpdateChangelog');
    }
  }

  public GetChangelogModel(data: IChangelogstruktur): mongoose.Document {

    try {

      const ChangelogmodelClass = model(this.Const.ChangelogcollectionName, Changelogshema);
      const Changelogmodel: mongoose.Document = new ChangelogmodelClass(data);

      return Changelogmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'ChangelogDBClass', 'GetChangelogModel');
    }
  }
}
