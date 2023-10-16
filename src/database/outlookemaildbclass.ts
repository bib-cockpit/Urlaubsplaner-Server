import {Document, DocumentQuery, model, Model} from "mongoose";
import {DebugClass} from "../debug";
import {Constclass} from "../constclass";
import * as mongoose from "mongoose";
import {Outlookemailshema, IOutlookemailstruktur} from "../datenstrukturen/outlookemailstruktur_server";

export class Outlookemaildbclass {

  private Debug: DebugClass;
  private Const: Constclass;

  constructor() {

    this.Debug = new DebugClass();
    this.Const = new Constclass();
  }

  public ReadEmail(emailid: string): Promise<any> {

    try {

      let EmailmodelClass: mongoose.Model<mongoose.Document>;
      let Email: IOutlookemailstruktur;

      return new Promise((resolve, reject) => {

        EmailmodelClass = model(this.Const.EmailcollectionName, Outlookemailshema);

        EmailmodelClass.findById(emailid).then((data: any) => {

          Email = data._doc;

          resolve(Email);

        }).catch((error: any) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'EmailDBClass', 'ReadEmailliste');
    }
  }

  public AddEmail(data: IOutlookemailstruktur):Promise<any> {

    try {

      let Emailmodel: mongoose.Document;

      return new Promise<any>((resolve, reject) => {

        delete data._id;

        Emailmodel = this.GetEmailModel(data);

        Emailmodel.save().then((result: Document<any>) => {

          resolve(result);

        }).catch((error) => {

          reject(error);
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'EmailDBClass', 'AddEmail');
    }
  }


  public UpdateEmail(data: IOutlookemailstruktur):Promise<any> {

    try {

      let EmailmodelClass: mongoose.Model<mongoose.Document>;

      return new Promise<any>((resolve, reject) => {

        EmailmodelClass = model(this.Const.EmailcollectionName, Outlookemailshema);

        EmailmodelClass.findById(data._id).then((Email: mongoose.Document) => {

          if(Email) {

            Email.set(data);
            Email.save().then((result: Document) => {

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

      this.Debug.ShowErrorMessage(error.message, error,  'EmailDBClass', 'UpdateEmail');
    }
  }

  public GetEmailModel(data: IOutlookemailstruktur): mongoose.Document {

    try {

      const EmailmodelClass = model(this.Const.EmailcollectionName, Outlookemailshema);
      const Emailmodel: mongoose.Document = new EmailmodelClass(data);

      return Emailmodel;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error,  'EmailDBClass', 'GetEmailModel');
    }
  }
}
