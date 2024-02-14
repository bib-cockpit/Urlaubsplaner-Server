import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";

interface IRechnungstruktur  {

  RechnungID:  string;
  Nummer: number;
  Zeitstempel: number;
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

  CanDelete?: boolean;
};

const Rechnungshema = new mongoose.Schema({

  RechnungID:  {type: String,  required: false},
  Nummer:      {type: Number,  required: false, default: 0},
  Zeitstempel: {type: Number,  required: false, default: 0},
  Verfasser:     Verfassershema,
  Betreff:                   {type: String,   required: false},
  Nachricht:                 {type: String,   required: false},
  CcEmpfaengerExternIDListe: {type: [String], required: false},
  CcEmpfaengerInternIDListe: {type: [String], required: false},
  EmpfaengerExternIDListe:   {type: [String], required: false},
  EmpfaengerInternIDListe:   {type: [String], required: false},
  Filename:                  {type: String,   required: false},
  FileID:                    {type: String,   required: false},
  GesendetZeitstempel:       {type: Number,   required: false},
  GesendetZeitstring:        {type: String,   required: false},


}, {_id: false});

export { IRechnungstruktur, Rechnungshema }
