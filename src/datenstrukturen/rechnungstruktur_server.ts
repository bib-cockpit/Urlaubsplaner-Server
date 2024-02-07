import mongoose from "mongoose";

interface IRechnungstruktur  {

  RechnungID:  string;
  Nummer: number;
  Zeitstempel: number;

  CanDelete?: boolean;
};

const Rechnungshema = new mongoose.Schema({

  RechnungID:  {type: String,  required: false},
  Nummer:      {type: Number,  required: false, default: 0},
  Zeitstempel: {type: Number,  required: false, default: 0},

}, {_id: false});

export { IRechnungstruktur, Rechnungshema }
