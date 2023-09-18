import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {IProjektpunktanmerkungstruktur, Projektpunktanmerkungshema} from "./projektpunktanmerkungstruktur_server";
import mongoose from "mongoose";
import {IProjektpunktimagestruktur, Projektpunktimageshema} from "./projektpunktimagestruktur_server";

interface IProjektpunktestruktur {

  _id:                 string;
  ProjektID:           string;
  ProjektleiterID:     string;
  ProtokollID:         string;
  LOPListeID:          string;
  EmailID:             string;
  UrsprungID:          string;
  Prioritaet:          string;
  Projektkey:          string;
  NotizenID:           string;
  PlanungsmatrixID:       string;
  AufgabenbereichID:      string;
  AufgabenteilbereichID:  string;
  FestlegungskategorieID: string;
  Matrixanwendung:     boolean;
  Listenposition:      number;
  Nummer:              string;
  Aufgabe:             string;
  OutlookkatgorieID:   string;
  Thematik:            string;
  Startzeitsptempel:   number;
  Startzeitstring:     string;
  Endezeitstempel:     number;
  Endezeitstring:      string;
  EndeKalenderwoche:   number;
  Geschlossenzeitstempel: number;
  Geschlossenzeitstring:  string;
  Status:              string;
  DataChanged:         boolean;
  ProtokollOnly:       boolean;
  ProtokollPublic:     boolean;
  LiveEditor:          boolean;
  Meilenstein:         boolean;
  Meilensteinstatus:   string;
  BemerkungMouseOver:  boolean;
  EndeMouseOver:       boolean;
  Meintag:             boolean;
  Meintagstatus:       string;
  Zeitansatz:          number;
  Zeitansatzeinheit:   string;
  FileDownloadURL:     string;
  Filename:            string;
  Filezoom:            number;
  Bildbreite:          number;
  Bildhoehe:           number;
  Querdarstellung:     boolean;
  Anmerkungenliste:    IProjektpunktanmerkungstruktur[];
  Fortschritt:         number;
  OpenFestlegung:      boolean;
  Fachbereich:         string;
  Deleted:             boolean;
  Leistungsphase:      string;
  Bilderliste:         IProjektpunktimagestruktur[];

  Verfasser: IVerfasserstruktur;

  BauteilID: string;
  GeschossID: string;
  RaumID: string;
  Oberkostengruppe:  number;
  Hauptkostengruppe: number;
  Unterkostengruppe: number;

  ZustaendigeExternIDListe: string[];
  ZustaendigeInternIDListe: string[];
  Zustaendigkeitsliste?:    string[];

  Kostengruppenname?: string;
};

const Projektpunktshema = new mongoose.Schema({

  ProjektID:              {type: String,  required: false},
  ProjektleiterID:        {type: String,  required: false},
  ProtokollID:            {type: String,  required: false},
  LOPListeID:             {type: String,  required: false},
  EmailID:                {type: String,  required: false},
  UrsprungID:             {type: String,  required: false},
  PlanungsmatrixID:       {type: String,  required: false},
  AufgabenbereichID:      {type: String,  required: false},
  AufgabenteilbereichID:  {type: String,  required: false},
  Leistungsphase:         {type: String,  required: false},
  Prioritaet:             {type: String,  required: false},
  Projektkey:             {type: String,  required: false},
  NotizenID:              {type: String,  required: false},
  FestlegungskategorieID: {type: String,  required: false},
  Listenposition:         {type: Number,  required: false},
  Nummer:                 {type: String,  required: false},
  Aufgabe:                {type: String,  required: false},
  OutlookkatgorieID:      {type: String,  required: false},
  Thematik:               {type: String,  required: false},
  Startzeitsptempel:      {type: Number,  required: false},
  Startzeitstring:        {type: String,  required: false},
  Endezeitstempel:        {type: Number,  required: false},
  Endezeitstring:         {type: String,  required: false},
  EndeKalenderwoche:      {type: Number,  required: false, default: null},
  Geschlossenzeitstempel: {type: Number,  required: false},
  Geschlossenzeitstring:  {type: String,  required: false},
  Status:                 {type: String,  required: false},
  ProtokollOnly:          {type: Boolean, required: false, default: false},
  ProtokollPublic:        {type: Boolean, required: false, default: true},
  Meilenstein:            {type: Boolean, required: false, default: false},
  Matrixanwendung:        {type: Boolean, required: false, default: true},
  Meilensteinstatus:      {type: String,  required: false},
  FileDownloadURL:        {type: String,  required: false},
  Filename:               {type: String,  required: false},
  Filezoom:               {type: Number,  required: false, default: false},
  Bildbreite:             {type: Number,  required: false, default: false},
  Bildhoehe:              {type: Number,  required: false, default: false},
  Querdarstellung:        {type: Boolean, required: false, default: false},
  OpenFestlegung:         {type: Boolean, required: false, default: false},
  Anmerkungenliste:       [Projektpunktanmerkungshema],
  Fortschritt:            {type: Number,  required: false, default: false},
  Fachbereich:            {type: String,  required: false},
  Verfasser:              Verfassershema,
  BauteilID:              {type: String,  required: false},
  GeschossID:             {type: String,  required: false},
  RaumID:                 {type: String,  required: false},
  Zeitansatz:             {type: Number,  required: false, default: false},
  Zeitansatzeinheit:      {type: String,  required: false},
  Oberkostengruppe:       {type: Number,  required: false},
  Hauptkostengruppe:      {type: Number,  required: false},
  Unterkostengruppe:      {type: Number,  required: false},
  ZustaendigeExternIDListe: [{type: String}],
  ZustaendigeInternIDListe: [{type: String}],
  Bilderliste:              [Projektpunktimageshema],
  Deleted:                  {type: Boolean, required: false, default: false},
});

export { IProjektpunktestruktur, Projektpunktshema };

