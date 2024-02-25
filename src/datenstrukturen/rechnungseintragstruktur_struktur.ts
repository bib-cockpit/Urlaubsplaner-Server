import mongoose from "mongoose";
import {Honorarsummenstruktur} from "./honorarsummenstruktur_server";

interface IRechnungseintragstruktur  {

  RechnungID:    string;
  Honoraranteil: number;

  Valid?: boolean;
  Honorarberechnung?: Honorarsummenstruktur;
};

const Rechnungseintraghema = new mongoose.Schema({

  RechnungID:    {type: String,  required: false},
  Honoraranteil: {type: Number,  required: false, default: 0},

}, {_id: false});

export { IRechnungseintragstruktur, Rechnungseintraghema }
