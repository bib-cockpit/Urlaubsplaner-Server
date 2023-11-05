import mongoose from "mongoose";
import {Aufgabenansichtshema, IAufgabenansichtstruktur} from "./aufgabenansichtstruktur_server";

interface IMitarbeitersettingsstruktur  {

  _id:                   string;
  MitarbeiterID:         string;
  FavoritenID:           string;
  ProjektID:             string;
  Zoomfaktor:            number;
  Textsize:              number;
  Favoritprojektindex:   number;
  StandortFilter:        string;
  LeistungsphaseFilter:  string;
  OberkostengruppeFilter:  number;
  HauptkostengruppeFilter: number;
  UnterkostengruppeFilter: number;

  /*
  AufgabenShowOffen:        boolean;
  AufgabenShowGeschlossen:  boolean;
  AufgabenShowBearbeitung:  boolean;
  AufgabenShowRuecklauf:    boolean;
  AufgabenShowBilder:       boolean;
  AufgabenShowMeilensteinOnly: boolean;
   AufgabenShowMeilensteine:  boolean;

   */

  Aufgabenansicht: IAufgabenansichtstruktur[];

  AufgabenTerminfiltervariante:  string;
  AufgabenTerminfilterStartwert: number;
  AufgabenTerminfilterEndewert:  number;

  AufgabenSortiermodus:  string;

  AufgabenMeilensteineNachlauf: number;

  Deleted:                  boolean;
  HeadermenueMaxFavoriten:  number;


  AufgabenShowNummer:        boolean;
  AufgabenShowStartdatum:    boolean;
  AufgabenShowAufgabe:       boolean;
  AufgabenShowBemerkung:     boolean;
  AufgabenShowTage:          boolean;
  AufgabenShowTermin:        boolean;
  AufgabenShowStatus:        boolean;
  AufgabenShowFortschritt:   boolean;
  AufgabenShowZustaendig:    boolean;
  AufgabenShowMeintag:       boolean;
  AufgabenShowZeitansatz:    boolean;
  AufgabenShowMeinewoche:    boolean;

  UrlaubShowBeantragt:         boolean;
  UrlaubShowVertreterfreigabe: boolean;
  UrlaubShowGenehmigt:         boolean;
  UrlaubShowAbgelehnt:         boolean;
  UrlaubShowFerien:            boolean;
  UrlaubShowFeiertage:         boolean;

  LOPListeGeschlossenZeitfilter: number;
};

const Mitarbeitersettingsshema = new mongoose.Schema({

  MitarbeiterID:         {type: String, required: false},
  FavoritenID:           {type: String, required: false},
  ProjektID:             {type: String, required: false},
  Favoritprojektindex:   {type: Number,  default: null},
  StandortFilter:        {type: String, required: false},
  LeistungsphaseFilter:  {type: String, required: false},
  Zoomfaktor:            {type: Number, required: false},
  Textsize:              {type: Number, required: false},

  AufgabenShowOffen:           {type: Boolean, default: false},
  AufgabenShowGeschlossen:     {type: Boolean, default: false},
  AufgabenShowBearbeitung:     {type: Boolean, default: false},
  AufgabenShowRuecklauf:       {type: Boolean, default: false},
  AufgabenShowMeilensteinOnly: {type: Boolean, default: false},
  AufgabenShowBilder:          {type: Boolean, default: false},

  Deleted:                  {type: Boolean, default: false},
  HeadermenueMaxFavoriten:  {type: Number,  default: 6},

  AufgabenSortiermodus:     {type: String, required: false, default: 'TermineAufsteigend'},

  AufgabenMeilensteineNachlauf:   {type: Number,  default: 2},

  AufgabenTerminfiltervariante:  {type: String, required: false, default: null},
  AufgabenTerminfilterStartwert: {type: Number, required: false, default: null},
  AufgabenTerminfilterEndewert:  {type: Number, required: false, default: null},

  OberkostengruppeFilter:   {type: Number, required: false, default: null},
  HauptkostengruppeFilter:  {type: Number, required: false, default: null},
  UnterkostengruppeFilter:  {type: Number, required: false, default: null},

  AufgabenShowMeilensteine:  {type: Boolean, default: false},
  AufgabenShowMeintag:       {type: Boolean, default: false},
  AufgabenShowNummer:        {type: Boolean, default: false},
  AufgabenShowStartdatum:    {type: Boolean, default: false},
  AufgabenShowAufgabe:       {type: Boolean, default: false},
  AufgabenShowBemerkung:     {type: Boolean, default: false},
  AufgabenShowTage:          {type: Boolean, default: false},
  AufgabenShowTermin:        {type: Boolean, default: false},
  AufgabenShowStatus:        {type: Boolean, default: false},
  AufgabenShowFortschritt:   {type: Boolean, default: false},
  AufgabenShowZustaendig:    {type: Boolean, default: false},
  AufgabenShowZeitansatz:    {type: Boolean, default: false},
  AufgabenShowMeinewoche:    {type: Boolean, default: false},
  Aufgabenansicht:           [Aufgabenansichtshema],
  LOPListeGeschlossenZeitfilter:    {type: Number, default: false},

  UrlaubShowBeantragt:         {type: Boolean, default: true},
  UrlaubShowVertreterfreigabe: {type: Boolean, default: true},
  UrlaubShowGenehmigt:         {type: Boolean, default: true},
  UrlaubShowAbgelehnt:         {type: Boolean, default: true},
  UrlaubShowFerien:            {type: Boolean, default: true},
  UrlaubShowFeiertage:         {type: Boolean, default: true},
});

export { Mitarbeitersettingsshema, IMitarbeitersettingsstruktur };
