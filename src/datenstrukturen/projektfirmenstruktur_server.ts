import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";

interface IProjektfirmenstruktur {

    FirmenID: string;
    Fachfirmentyp: number;
    Firma: string;
    Kuerzel: string;
    Strasse: string;
    PLZ: string;
    Ort: string;
    Telefon: string;
    Mobil: string;
    Email: string;
    Verfasser: IVerfasserstruktur;
    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
    Selected?: boolean;
    Color?: string;
    Sortvalue?: string;
};

const Projektfirmenshema = new mongoose.Schema({

  FirmenID:      {type: String,  required: false},
  Fachfirmentyp: {type: Number,  required: false},
  Firma:         {type: String,  required: false},
  Kuerzel:       {type: String,  required: false},
  Strasse:       {type: String,  required: false},
  Ort:           {type: String,  required: false},
  PLZ:           {type: String,  required: false},
  Telefon:       {type: String,  required: false},
  Mobil:         {type: String,  required: false},
  Email:         {type: String,  required: false},
  Verfasser:     Verfassershema,
});

export { IProjektfirmenstruktur, Projektfirmenshema };
