import mongoose from "mongoose";

interface IRechnungseintragstruktur  {

  RechnungID:    string;
  Honoraranteil: number;

  Valid?: boolean;
  Nettohonorar?: number;
  Nettonebenkosten?: number;
  Nettogesamthonorar?: number;
  Mehrwertsteuer?: number;
  Bruttogesamthonorar?: number;
};

const Rechnungseintraghema = new mongoose.Schema({

  RechnungID:    {type: String,  required: false},
  Honoraranteil: {type: Number,  required: false, default: 0},

}, {_id: false});

export { IRechnungseintragstruktur, Rechnungseintraghema }
