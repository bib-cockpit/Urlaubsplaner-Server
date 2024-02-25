import mongoose from "mongoose";
import {IRechnungseintragstruktur, Rechnungseintraghema} from "./rechnungseintragstruktur_struktur";

interface ISimontabelleeintragstruktur  {

  Buchstabe:    string;
  Beschreibung: string;
  Von: number;
  Bis: number;
  Vertrag: number;
  Rechnungseintraege: IRechnungseintragstruktur[];

  Honorarsumme?: number;
  Honorarsummeprozent?: number;
  Nettohonorar?: number;
  Nettoumbauzuschlag?: number;
  Bruttoumbauzuschlag?: number;
  Nettoleistungen?: number;
  Nettozwischensumme?: number;
  Nettonebenkosten?: number;
  Nettogesamthonorar?: number;
  Mehrwertsteuer?: number;
  Bruttogesamthonorar?: number;
};

const Simontabelleeintragshema = new mongoose.Schema({

  Buchstabe: {type: String,  required: false},
  Vertrag:   {type: String,  required: false},
  Rechnungseintraege: [Rechnungseintraghema]

}, {_id: false});

export { ISimontabelleeintragstruktur, Simontabelleeintragshema };
