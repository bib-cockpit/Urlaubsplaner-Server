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
  Status:               string;
  Verfasser:            IVerfasserstruktur;
  Beteiligtenliste:     IProjektbeteiligtestruktur[];
  Bauteilliste:         IBauteilstruktur[];
};

const Projekteshema = new mongoose.Schema({

  Projektname:      {type: String,  required: false},
  ProjektleiterID:  {type: String,  required: false},
  StellvertreterID: {type: String,  required: false},
  StandortID:       {type: String,  required: false},
  Projektkey:       {type: String,  required: false},
  Projektkurzname:  {type: String,  required: false},
  Projektfarbe:     {type: String,  required: false},
  Projektnummer:    {type: String,  required: false},
  Status:           {type: String,  required: false},
  Strasse:          {type: String,  required: false},
  PLZ:              {type: String,  required: false},
  Ort:              {type: String,  required: false},
  Deleted:          {type: Boolean, required: false, default: false},
  Zeitstempel:      {type: Number, required: false},
  Zeitpunkt:        {type: String, required: false},
  Verfasser:        Verfassershema,
  Beteiligtenliste: [Projektbeteiligteeshema],
  Bauteilliste:     [Bauteilshema]
});

export { IProjektestruktur, Projekteshema };

