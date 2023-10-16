import mongoose from "mongoose";

interface IProjektpunktimagestruktur  {

  FileID: string;
  WebUrl: string;
};

const Projektpunktimageshema = new mongoose.Schema({

  FileID: {type: String, required: false},
  WebUrl: {type: String, required: false},

});

export { IProjektpunktimagestruktur, Projektpunktimageshema };
