import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import mongoose from "mongoose";
import {IProjektpunktestruktur} from "./projektpunktestruktur_server";
import {IProjektbeteiligtestruktur} from "./projektbeteiligtestruktur_server";
import {IMitarbeiterstruktur} from "./mitarbeiterstruktur_server";

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
  ShowDetails: boolean;
  DownloadURL: string;
  Verfasser: IVerfasserstruktur;
  Deleted: boolean;

  Betreff: string,
  Nachricht: string,
  CcEmpfaengerExternIDListe: string[],
  CcEmpfaengerInternIDListe: string[],
  EmpfaengerExternIDListe: string[],
  EmpfaengerInternIDListe: string[],
  Filename: string,
  GesendetZeitstempel: number,
  GesendetZeitstring: string,

  Projektpunkteliste?: IProjektpunktestruktur[];
  Kostengruppenliste?: string[];
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

export { IProtokollstruktur, Protokollshema };
