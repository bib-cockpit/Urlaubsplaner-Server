import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";

interface INotizenkapitelabschnittstruktur  {

  KapitelabschnittID: string;
  Titel:              string;
  HTML:               string;
};


const Notizenkapitelabschnittshema = new mongoose.Schema({

  _id:                false,
  KapitelabschnittID: {type: String, required: false},
  Titel:              {type: String, required: false},
  HTML:               {type: String, required: false},

});

export { INotizenkapitelabschnittstruktur, Notizenkapitelabschnittshema };
