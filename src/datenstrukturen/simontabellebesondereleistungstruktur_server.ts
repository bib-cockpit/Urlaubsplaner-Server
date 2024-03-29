import mongoose from "mongoose";
import {IRechnungseintragstruktur, Rechnungseintraghema} from "./rechnungseintragstruktur_struktur";

interface ISimontabellebesondereleistungstruktur  {

  LeistungID:   string;
  Nummer:       string;
  Titel:        string;
  Beschreibung: string;
  Honorar:      number;
  Rechnungseintraege: IRechnungseintragstruktur[];
};

const Simontabellebesondereleistungshema = new mongoose.Schema({

  LeistungID:   {type: String,  required: false},
  Nummer:       {type: String,  required: false},
  Titel:        {type: String,  required: false},
  Beschreibung: {type: String,  required: false},
  Honorar:      {type: Number,  required: false, default: 0},
  Rechnungseintraege: [Rechnungseintraghema]

}, {_id: false} );

export { ISimontabellebesondereleistungstruktur, Simontabellebesondereleistungshema };
