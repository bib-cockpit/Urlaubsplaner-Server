import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {IProjektpunktestruktur} from "./projektpunktestruktur_server";
import mongoose from "mongoose";


interface ILOPListestruktur  {

  _id: string;
  Projektkey: string;
  ProjektID: string;
  Titel: string;
  LOPListenummer: string;
  BeteiligExternIDListe:  string[];
  BeteiligtInternIDListe: string[];
  ProjektpunkteIDListe:   string[];
  Notizen: string;
  Zeitstempel: number;
  Zeitstring: string;
  Besprechungsort: string;
  ShowDetails: boolean;
  DownloadURL: string;
  Verfasser: IVerfasserstruktur;
  EmpfaengerExternIDListe: string[];
  EmpfaengerInternIDListe: string[];
  CcEmpfaengerExternIDListe: string[];
  CcEmpfaengerInternIDListe: string[];
  Betreff: string;
  Nachricht: string;
  Filename: string;
  FileID: string;
  GesendetZeitstring:  string;
  GesendetZeitstempel: number;
  Deleted: boolean;
  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
  __v?: any;
  Punkteanzahl?: number;
  Kostengruppenliste?: string[];
  Projektpunkteliste?: IProjektpunktestruktur[];
  ExternZustaendigListe?: string[][];
  InternZustaendigListe?: string[][];
  ExterneTeilnehmerliste?: string[];
  InterneTeilnehmerliste?: string[];
  CcEmpfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
  Empfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
};


const LOPListeshema = new mongoose.Schema({

  Projektkey:             {type: String,   required: false},
  ProjektID:              {type: String,   required: false},
  Titel:                  {type: String,   required: false},
  LOPListenummer:         {type: String,   required: false},
  BeteiligExternIDListe:  {type: [String], required: false},
  BeteiligtInternIDListe: {type: [String], required: false},
  ProjektpunkteIDListe:   {type: [String], required: false},
  Notizen:                {type: String,   required: false},
  Zeitstempel:            {type: Number,   required: false},
  Zeitstring:             {type: String,   required: false},
  Besprechungsort:        {type: String,   required: false},
  ShowDetails:            {type: Boolean,  required: false},
  DownloadURL:            {type: String,   required: false},
  Deleted:                {type: Boolean,  required: false},
  Verfasser:              Verfassershema,

  Betreff:                   {type: String,   required: false},
  Nachricht:                 {type: String,   required: false},
  CcEmpfaengerExternIDListe: {type: [String], required: false},
  CcEmpfaengerInternIDListe: {type: [String], required: false},
  EmpfaengerExternIDListe:   {type: [String], required: false},
  EmpfaengerInternIDListe:   {type: [String], required: false},
  Filename:                  {type: String,   required: false},
  GesendetZeitstempel:       {type: Number,   required: false},
  GesendetZeitstring:        {type: String,   required: false},
});

export { ILOPListestruktur, LOPListeshema };
