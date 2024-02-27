import * as mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {IProjektbeteiligtestruktur, Projektbeteiligteeshema} from "./projektbeteiligtestruktur_server";
import {Bauteilshema, IBauteilstruktur} from "./bauteilstruktur_server";
import {IProjektfirmenstruktur, Projektfirmenshema} from "./projektfirmenstruktur_server";

interface IProjektestruktur  {

  _id:                  string;
  ProjektleiterID:      string;
  StellvertreterID:     string;
  StandortID:           string;
  Projektkey:           string;
  Zeitstempel:          number;
  Zeitpunkt:            string;
  Projektmailadresse:   string;
  Strasse:              string;
  PLZ:                  string;
  Ort:                  string;
  Projektname:          string;
  OutlookkategorieID:   string;
  Projektkurzname:      string;
  Projektnummer:        string;
  Leistungsphase:       string;
  Status:               string;
  Verfasser:            IVerfasserstruktur;
  Beteiligtenliste:     IProjektbeteiligtestruktur[];
  Firmenliste:          IProjektfirmenstruktur[];
  Bauteilliste:         IBauteilstruktur[];
  MitarbeiterIDListe:   string[];
  ProjektIsReal:        boolean;

  DisplayKG410: boolean;
  DisplayKG420: boolean;
  DisplayKG430: boolean;
  DisplayKG434: boolean;
  DisplayKG440: boolean;
  DisplayKG450: boolean;
  DisplayKG460: boolean;
  DisplayKG475: boolean;
  DisplayKG480: boolean;
  DisplayBeschreibungen: boolean;
  DisplayUngenutzte: boolean;

  TeamsID:          string;
  TeamsDescription: string;
  TeamsName:        string;

  ProjektFolderID:       string;
  ProtokolleFolderID:    string;
  BautagebuchFolderID:   string;
  BaustellenLOPFolderID: string;
  RechnungListefolderID: string;
  LastLOPEintragnummer:   number;
};

const Projekteshema = new mongoose.Schema({

  Projektname:      {type: String,  required: false, index: true },
  ProjektleiterID:  {type: String,  required: false},
  StellvertreterID: {type: String,  required: false},
  StandortID:       {type: String,  required: false},
  Projektkey:       {type: String,  required: false},
  Projektmailadresse: {type: String,  required: false},
  Projektkurzname:  {type: String,  required: false},
  OutlookkategorieID: {type: String,  required: false},
  Projektnummer:    {type: String,  required: false},
  Leistungsphase:   {type: String,  required: false},
  Status:           {type: String,  required: false},
  Strasse:          {type: String,  required: false},
  PLZ:              {type: String,  required: false},
  Ort:              {type: String,  required: false},
  Deleted:          {type: Boolean, required: false, default: false},
  ProjektIsReal:    {type: Boolean, required: false, default: true},

  DisplayKG410:    {type: Boolean, required: false, default: false},
  DisplayKG420:    {type: Boolean, required: false, default: false},
  DisplayKG430:    {type: Boolean, required: false, default: false},
  DisplayKG434:    {type: Boolean, required: false, default: false},
  DisplayKG440:    {type: Boolean, required: false, default: false},
  DisplayKG450:    {type: Boolean, required: false, default: false},
  DisplayKG460:    {type: Boolean, required: false, default: false},
  DisplayKG475:    {type: Boolean, required: false, default: false},
  DisplayKG480:    {type: Boolean, required: false, default: false},

  DisplayBeschreibungen:    {type: Boolean, required: false, default: false},
  DisplayUngenutzte:        {type: Boolean, required: false, default: false},

  Zeitstempel:      {type: Number, required: false},
  Zeitpunkt:        {type: String, required: false},

  Verfasser:          Verfassershema,
  Beteiligtenliste:   [Projektbeteiligteeshema],
  Bauteilliste:       [Bauteilshema],
  Firmenliste:        [Projektfirmenshema],
  MitarbeiterIDListe: [{type: String}],

  LastLOPEintragnummer: {type: Number, required: false},
  TeamsID:              {type: String,  required: false},
  TeamsDescription:     {type: String,  required: false},
  TeamsName:            {type: String,  required: false},

  ProjektFolderID:       {type: String,  required: false},
  ProtokolleFolderID:    {type: String,  required: false},
  BautagebuchFolderID:   {type: String,  required: false},
  BaustellenLOPFolderID: {type: String,  required: false},
  RechnungListefolderID: {type: String,  required: false}
});

export { IProjektestruktur, Projekteshema };


