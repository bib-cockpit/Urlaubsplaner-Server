import mongoose from "mongoose";

interface IRechnungstruktur  {

  RechnungID:  string;
  Zeitstempel: number;
};

const Rechnungshema = new mongoose.Schema({

  RechnungID:          {type: String,  required: false},
  Zeitstempel:         {type: Number,  required: false, default: 0},

}, {_id: false});

export { IRechnungstruktur, Rechnungshema }
