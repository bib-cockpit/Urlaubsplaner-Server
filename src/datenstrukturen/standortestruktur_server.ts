import * as mongoose from "mongoose";

interface IStandortestruktur  {

  _id?: any;
  // StandortID: string;
  Standort: string;
  Kuerzel: string;
  Strasse: string;
  PLZ: string;
  Ort: string;
  Telefon: string;
  Email: string;
  Deleted: boolean;
  Zeitstempel: number;
  Zeitpunkt: string;
  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
};

const Standorteshema = new mongoose.Schema({

  Standort: {type: String,  required: false, index: true},
  Kuerzel:  {type: String,  required: false},
  Strasse:  {type: String,  required: false},
  PLZ:      {type: String,  required: false},
  Ort:      {type: String,  required: false},
  Telefon:  {type: String,  required: false},
  Email:    {type: String,  required: false},
  Deleted:  {type: Boolean, required: false, default: false},
  Zeitstempel: {type: Number, required: false},
  Zeitpunkt:   {type: String, required: false},
});

export { IStandortestruktur, Standorteshema };

