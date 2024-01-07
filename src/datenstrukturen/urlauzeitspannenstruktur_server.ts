import mongoose from "mongoose";

interface IUrlauzeitspannenstruktur {

  ZeitspannenID: string;
  Startstempel: number;
  Endestempel:  number;
  VertreterID:  string;
  Startstring:  string;
  Endestring:   string;
  Status:       string;
  Planungmeldung:    string;
  Vertretungmeldung: string;
  Freigabemeldung:   string;

  Tageanzahl: number;

  VertreteranfrageSended: boolean;
  VertreterantwortSended: boolean;
  FreigabeanfrageSended:  boolean;
  FreigabeantwortSended:  boolean;
  FreigabeantwortOfficeSended: boolean;

  Vertretunganfragezeitstempel: number;
  Vertretungantwortzeitstempel: number;
  Freigabeantwortzeitstempel: number;
  FreigabeantwortOfficezeitstempel: number;
};

const Urlaubszeitspannenshema = new mongoose.Schema({

  ZeitspannenID:  {type: String,   required: false},
  Startstempel:   {type: Number,   required: false},
  Endestempel:    {type: Number,   required: false},
  VertreterID:    {type: String,   required: false},
  Startstring:    {type: String,   required: false},
  Endestring:     {type: String,   required: false},
  Status:             {type: String,   required: false},
  Planungmeldung:     {type: String,   required: false},
  Vertretungmeldung:  {type: String,   required: false},
  Freigabemeldung:    {type: String,   required: false},
  Tageanzahl:     {type: Number,   required: false},

  VertreteranfrageSended: {type: Boolean, required: false},
  VertreterantwortSended: {type: Boolean, required: false},

  FreigabeanfrageSended: {type: Boolean, required: false},
  FreigabeantwortSended: {type: Boolean, required: false},
  FreigabeantwortOfficeSended: {type: Boolean, required: false},

  Vertretunganfragezeitstempel: {type: Number, required: false},
  Vertretungantwortzeitstempel: {type: Number, required: false},

  Freigabeantwortzeitstempel: {type: Number, required: false},
  FreigabeantwortOfficezeitstempel: {type: Number, required: false},

}, {_id: false});

export { IUrlauzeitspannenstruktur, Urlaubszeitspannenshema };
