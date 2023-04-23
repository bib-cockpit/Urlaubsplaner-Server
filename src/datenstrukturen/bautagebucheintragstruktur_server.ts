import mongoose from "mongoose";

interface IBautagebucheintragstruktur  {

  BautagebucheintragID: string;
  Arbeitszeit: number;
  Taetigkeit:  number;
};

const Bautagebucheintragshema = new mongoose.Schema({

  BautagebucheintragID: {type: String,    required: false},
  Arbeitszeit:          {type: Number,    required: false},
  Taetigkeit:           {type: String,    required: false},
});

export { IBautagebucheintragstruktur, Bautagebucheintragshema };
