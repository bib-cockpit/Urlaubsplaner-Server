import mongoose from "mongoose";
import {IRaumstruktur, Raumshema} from "./raumstruktur_server";

interface IGeschossstruktur  {

  GeschossID:      string;
  Geschossname:    string;
  Kurzbezeichnung: string;
  Listenposition:  number;
  Raumliste:       IRaumstruktur[];
  /*
  Plananzahlwaagrecht: number;
  Plananzahlsenkrecht: number;
  Planliste: Planlistenstruktur[];

   */
};

const Geschossshema = new mongoose.Schema({

  _id:             false,
  GeschossID:      {type: String,  required: false},
  Geschossname:    {type: String,  required: false},
  Kurzbezeichnung: {type: String,  required: false},
  Listenposition:  {type: Number,  required: false},
  Raumliste:       [Raumshema]

});

export { IGeschossstruktur, Geschossshema };
