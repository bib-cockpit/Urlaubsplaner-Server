import mongoose from "mongoose";

interface ISimontabelleeintragstruktur  {

  Buchstabe:    string;
  Beschreibung: string;
  Von: number;
  Bis: number;
  Vertrag: number;
};

const Simontabelleeintragshema = new mongoose.Schema({

  Buchstabe: {type: String,  required: false},
  Vertrag:   {type: String,  required: false},

}, {_id: false});

export { ISimontabelleeintragstruktur, Simontabelleeintragshema };
