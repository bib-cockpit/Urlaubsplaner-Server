import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";

interface IProjektbeteiligtestruktur  {

    BeteiligtenID: string;
    Beteiligtentyp: number;
    Beteiligteneintragtyp: string;
    Name: string;
    Anrede: string;
    Vorname: string;
    Firma: string;
    Kuerzel: string;
    Strasse: string;
    PLZ: string;
    Ort: string;
    Telefon: string;
    Mobil: string;
    Email: string;
    Verfasser:  IVerfasserstruktur;
};

const Projektbeteiligteeshema = new mongoose.Schema({

  _id:                   false,
  BeteiligtenID:         {type: String,  required: false},
  Beteiligtentyp:        {type: Number,  required: false},
  Beteiligteneintragtyp: {type: String,  required: false},
  Name:                  {type: String,  required: false},
  Vorname:               {type: String,  required: false},
  Anrede:                {type: String,  required: false},
  Firma:                 {type: String,  required: false},
  Kuerzel:               {type: String,  required: false},
  Strasse:               {type: String,  required: false},
  PLZ:                   {type: String,  required: false},
  Ort:                   {type: String,  required: false},
  Telefon:               {type: String,  required: false},
  Mobil:                 {type: String,  required: false},
  Email:                 {type: String,  required: false},
  Deleted:               {type: Boolean, required: false, default: false},
  Verfasser:             Verfassershema
});

export { IProjektbeteiligtestruktur, Projektbeteiligteeshema };
