
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import mongoose from "mongoose";

interface IFestlegungskategoriestruktur  {

  _id:               string;
  Projektkey:        string;
  Beschreibung:      string;
  Oberkostengruppe:  number;
  Hauptkostengruppe: number;
  Unterkostengruppe: number;
  Verfasser:         IVerfasserstruktur;
  Startzeitsptempel:   number;
  Startzeitstring:     string;
  Deleted: boolean;
};

// hello 2

const Festlegungskategorieshema = new mongoose.Schema({

  Projektkey:        {type: String,   required: false},
  Beschreibung:      {type: String,   required: false},
  Oberkostengruppe:  {type: Number,   required: false},
  Hauptkostengruppe: {type: Number,   required: false},
  Unterkostengruppe: {type: Number,   required: false},
  Verfasser:         Verfassershema,
  Zeitansatz:        {type: Number,  required: false, default: false},
  Zeitansatzeinheit: {type: String,  required: false},
  Deleted:           {type: Boolean, required: false, default: false},
});

export { IFestlegungskategoriestruktur, Festlegungskategorieshema };
