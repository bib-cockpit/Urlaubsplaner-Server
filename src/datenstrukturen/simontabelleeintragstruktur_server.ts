import mongoose from "mongoose";
import {IRechnungseintragstruktur, Rechnungseintraghema} from "./rechnungseintragstruktur_struktur";

interface ISimontabelleeintragstruktur  {

  Buchstabe:    string;
  Beschreibung: string;
  Von: number;
  Bis: number;
  Vertrag: number;
  Rechnungseintraege: IRechnungseintragstruktur[];
};

const Simontabelleeintragshema = new mongoose.Schema({

  Buchstabe: {type: String,  required: false},
  Vertrag:   {type: String,  required: false},
  Rechnungseintraege: [Rechnungseintraghema]

}, {_id: false});

export { ISimontabelleeintragstruktur, Simontabelleeintragshema };
