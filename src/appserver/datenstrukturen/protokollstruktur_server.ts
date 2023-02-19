import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import mongoose from "mongoose";

interface IProtokollstruktur  {

  _id: string;
  Projektkey: string;
  ProjektID: string;
  Titel: string;
  Protokollnummer: string;
  BeteiligExternIDListe: string[];
  BeteiligtInternIDListe:        string[];
  ProjektpunkteIDListe:         string[];
  Notizen: string;
  Zeitstempel: number;
  Zeitstring: string;
  Startstempel: number;
  Endestempel:  number;
  Besprechungsort: string;
  Leistungsphase: string;
  ShowDetails: boolean;
  DownloadURL: string;
  Verfasser: IVerfasserstruktur;
  Deleted: boolean;
};

const Protokollshema = new mongoose.Schema({

  Projektkey:             {type: String,   required: false},
  ProjektID:              {type: String,   required: false},
  Titel:                  {type: String,   required: false},
  Protokollnummer:        {type: String,   required: false},
  BeteiligExternIDListe:  {type: [String], required: false},
  BeteiligtInternIDListe: {type: [String], required: false},
  ProjektpunkteIDListe:   {type: [String], required: false},
  Notizen:                {type: String,   required: false},
  Zeitstempel:            {type: Number,   required: false},
  Zeitstring:             {type: String,   required: false},
  Startstempel:           {type: Number,   required: false},
  Endestempel:            {type: Number,   required: false},
  Besprechungsort:        {type: String,   required: false},
  Leistungsphase:         {type: String,   required: false},
  ShowDetails:            {type: Boolean,  required: false},
  DownloadURL:            {type: String,   required: false},
  Deleted:                {type: Boolean,  required: false},
  Verfasser:              Verfassershema
});

export { IProtokollstruktur, Protokollshema };
