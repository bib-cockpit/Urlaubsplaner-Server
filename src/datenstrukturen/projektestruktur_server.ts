import * as mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {IProjektbeteiligtestruktur, Projektbeteiligteeshema} from "./projektbeteiligtestruktur_server";
import {Bauteilshema, IBauteilstruktur} from "./bauteilstruktur_server";

interface IProjektestruktur  {

  _id:                  string;
  ProjektleiterID:      string;
  StellvertreterID:     string;
  StandortID:           string;
  Projektkey:           string;
  Zeitstempel:          number;
  Zeitpunkt:            string;
  Strasse:              string;
  PLZ:                  string;
  Ort:                  string;
  Projektname:          string;
  Projektfarbe:         string;
  Projektkurzname:      string;
  Projektnummer:        string;
  Leistungsphase:       string;
  Status:               string;
  Verfasser:            IVerfasserstruktur;
  Beteiligtenliste:     IProjektbeteiligtestruktur[];
  Bauteilliste:         IBauteilstruktur[];
  ProjektIsReal:        boolean;

  TeamsID:          string;
  TeamsDescription: string;
  TeamsName:        string;

  ProtokolleFolderID:    string;
  BautagebuchFolderID:   string;
  BaustellenLOPFolderID: string;
};

const Projekteshema = new mongoose.Schema({

  Projektname:      {type: String,  required: false, index: true },
  ProjektleiterID:  {type: String,  required: false},
  StellvertreterID: {type: String,  required: false},
  StandortID:       {type: String,  required: false},
  Projektkey:       {type: String,  required: false},
  Projektkurzname:  {type: String,  required: false},
  Projektfarbe:     {type: String,  required: false},
  Projektnummer:    {type: String,  required: false},
  Leistungsphase:   {type: String,  required: false},
  Status:           {type: String,  required: false},
  Strasse:          {type: String,  required: false},
  PLZ:              {type: String,  required: false},
  Ort:              {type: String,  required: false},
  Deleted:          {type: Boolean, required: false, default: false},
  ProjektIsReal:    {type: Boolean, required: false, default: true},
  Zeitstempel:      {type: Number, required: false},
  Zeitpunkt:        {type: String, required: false},
  Verfasser:        Verfassershema,
  Beteiligtenliste: [Projektbeteiligteeshema],
  Bauteilliste:     [Bauteilshema],


  TeamsID:          {type: String,  required: false},
  TeamsDescription: {type: String,  required: false},
  TeamsName:        {type: String,  required: false},

  ProtokolleFolderID:    {type: String,  required: false},
  BautagebuchFolderID:   {type: String,  required: false},
  BaustellenLOPFolderID: {type: String,  required: false},
});

export { IProjektestruktur, Projekteshema };

