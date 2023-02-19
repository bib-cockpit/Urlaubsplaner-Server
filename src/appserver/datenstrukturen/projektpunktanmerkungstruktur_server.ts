import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import mongoose from "mongoose";

interface IProjektpunktanmerkungstruktur  {

  AnmerkungID:               string;
  Nummer:                    number;
  Anmerkung:                 string;
  Zeitstempel:               number;
  Zeitstring:                string;
  Verfasser:                 IVerfasserstruktur;
};

const Projektpunktanmerkungshema = new mongoose.Schema({

  _id:             false,
  AnmerkungID:     {type: String,    required: false},
  Nummer:          {type: Number,    required: false},
  Anmerkung:       {type: String,    required: false},
  Zeitstempel:     {type: Number,    required: false},
  Zeitstring:      {type: String,    required: false},
  Verfasser: Verfassershema,

});

export { IProjektpunktanmerkungstruktur, Projektpunktanmerkungshema };
