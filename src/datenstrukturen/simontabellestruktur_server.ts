import mongoose from "mongoose";
import {Bautagebucheintragshema} from "./bautagebucheintragstruktur_server";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";
import {ISimontabelleeintragstruktur, Simontabelleeintragshema} from "./simontabelleeintragstruktur_server";
import {
  ISimontabellebesondereleistungstruktur,
  Simontabellebesondereleistungshema
} from "./simontabellebesondereleistungstruktur_server";
import {IRechnungstruktur, Rechnungshema} from "./rechnungstruktur_server";

interface ISimontabellestruktur  {

  _id: string;
  Projektkey: string;
  Leistungsphase: string;
  Anlagengruppe:  number;
  Durchschnittswert: number;
  Verfasser: IVerfasserstruktur;
  Eintraegeliste: ISimontabelleeintragstruktur[];
  Deleted: boolean;
  Kosten: number;
  Nettobasishonorar: number;
  Umbauzuschlag: number;
  Sicherheitseinbehalt: number;
  Nebenkosten: number;
  Besondereleistungenliste: ISimontabellebesondereleistungstruktur[];
  Rechnungen: IRechnungstruktur[];

  Nettoumbauzuschlag?: number;
  Nettoleistungen?:    number;
  Nettogrundhonorar?:  number;
  Nettonebenkosten?:   number;
  Nettogesamthonorar?: number;
};

const Simontabelleshema = new mongoose.Schema({

  Projektkey:           {type: String,  required: false},
  Leistungsphase:       {type: String,  required: false},
  Kosten:               {type: Number,  required: false, default: 0},
  Nettobasishonorar:    {type: Number,  required: false, default: 0},
  Umbauzuschlag:        {type: Number,  required: false, default: 0},
  Sicherheitseinbehalt: {type: Number,  required: false, default: 0},
  Nebenkosten:          {type: Number,  required: false, default: 0},
  Besondereleistungenliste: [Simontabellebesondereleistungshema],
  Anlagengruppe:       {type: Number,  required: false},
  Deleted:           {type: Boolean, required: false, default: true},
  Verfasser:         Verfassershema,
  Eintraegeliste:    [Simontabelleeintragshema],
  Rechnungen:        [Rechnungshema],

});

export { ISimontabellestruktur, Simontabelleshema };
