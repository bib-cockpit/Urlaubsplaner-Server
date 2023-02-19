import {Geschossshema, IGeschossstruktur} from "./geschossstruktur_server";
import mongoose from "mongoose";

interface IBauteilstruktur  {

  BauteilID:      string;
  Bauteilname:    string;
  Listenposition: number;
  Geschossliste:  IGeschossstruktur[];
};

const Bauteilshema = new mongoose.Schema({

  _id:              false,
  BauteilID:        {type: String,  required: false},
  Bauteilname:      {type: String,  required: false},
  Listenposition:   {type: Number,  required: false},
  Geschossliste:    [Geschossshema],
});

export { IBauteilstruktur, Bauteilshema };

