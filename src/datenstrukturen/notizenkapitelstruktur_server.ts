import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {INotizenkapitelabschnittstruktur, Notizenkapitelabschnittshema} from "./notizenkapitelabschnittstruktur_server";

interface INotizenkapitelstruktur  {

  _id:         string;
  Titel:       string;
  ProjektID:   string;
  Projektkey:  string;
  Zeitstring:  string;
  Zeitstempel: number;
  Deleted:     boolean;
  Verfasser:      IVerfasserstruktur;
  Abschnittliste: INotizenkapitelabschnittstruktur
};


const Notizenkapitelshema = new mongoose.Schema({

  Titel:          {type: String, required: false},
  ProjektID:      {type: String, required: false},
  Projektkey:     {type: String, required: false},
  Zeitstring:     {type: String, required: false},
  Zeitstempel:    {type: Number, required: false},
  Deleted:        {type: Boolean, required: false},
  Verfasser:      Verfassershema,
  Abschnittliste: [Notizenkapitelabschnittshema]

});

export { INotizenkapitelstruktur, Notizenkapitelshema };
