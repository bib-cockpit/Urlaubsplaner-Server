import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import mongoose from "mongoose";
import {Bautagebucheintragshema, IBautagebucheintragstruktur} from "./bautagebucheintragstruktur_server";
import {IProjektpunktestruktur} from "./projektpunktestruktur_server";

interface IBautagebuchstruktur  {

  _id: string;
  Projektkey: string;
  ProjektID: string;
  Nummer: string;
  Auftraggeber: string;
  Verfasser: IVerfasserstruktur;
  Gewerk: string;
  Bezeichnung: string;
  Leistung: string;
  Regen: boolean;
  Frost: boolean;
  Schnee: boolean;
  Wind: boolean;
  Sonnig: boolean;
  Bewoelkt: boolean;
  Bedeckt: boolean;
  Vorarbeiter: string;
  Facharbeiter: string;
  Helfer: string;
  Lehrling: string;
  Temperatur: string;
  Behinderungen: string;
  BeteiligtInternIDListe: string[];
  BeteiligtExternIDListe: string[];
  Vorkommnisse: string;
  Eintraegeliste: IBautagebucheintragstruktur[];
  Zeitstempel: number;
  Zeitstring: string;
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

const Bautagebuchshema = new mongoose.Schema({

  Projektkey:    {type: String,  required: false},
  ProjektID:     {type: String,  required: false},
  Nummer:        {type: String,  required: false},
  Auftraggeber:  {type: String,  required: false},
  BeteiligtInternIDListe: {type: [String], required: false},
  BeteiligtExternIDListe: {type: [String], required: false},
  Verfasser:     Verfassershema,
  Gewerk:        {type: String,  required: false},
  Bezeichnung:   {type: String,  required: false},
  Leistung:      {type: String,  required: false},
  Regen:         {type: Boolean,  required: false},
  Frost:         {type: Boolean,  required: false},
  Schnee:        {type: Boolean,  required: false},
  Wind:          {type: Boolean,  required: false},
  Sonnig:        {type: Boolean,  required: false},
  Bewoelkt:      {type: Boolean,  required: false},
  Bedeckt:       {type: Boolean,  required: false},
  Vorarbeiter:   {type: String,  required: false},
  Facharbeiter:  {type: String,  required: false},
  Helfer:        {type: String,  required: false},
  Lehrling:      {type: String,  required: false},
  Temperatur:    {type: String,  required: false},
  Behinderungen: {type: String,  required: false},
  Vorkommnisse:  {type: String,  required: false},
  Zeitstempel:   {type: Number,    required: false},
  Zeitstring:    {type: String,    required: false},
  Deleted:       {type: Boolean, required: false, default: false},
  Eintraegeliste: [Bautagebucheintragshema],

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

export { IBautagebuchstruktur, Bautagebuchshema };
