import mongoose from "mongoose";

interface IProjektpunktimagestruktur  {

  FileID: string;
  WebUrl: string;
  Filename: string;
  Filesize: number;
};

const Projektpunktimageshema = new mongoose.Schema({

  FileID:   {type: String, required: false},
  WebUrl:   {type: String, required: false},
  Filename: {type: String, required: false},
  Filesize: {type: Number, required: false},

});

export { IProjektpunktimagestruktur, Projektpunktimageshema };

