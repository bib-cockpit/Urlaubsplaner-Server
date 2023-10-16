import mongoose from "mongoose";

interface IMeintagstruktur  {

  ProjektID:           string;
  ProjektpunktID:      string;
  Checkedstatus:       string;
};


const Meintagshema = new mongoose.Schema({

  _id:            false,
  ProjektID:      {type: String, required: false},
  ProjektpunktID: {type: String, required: false},
  Checkedstatus:  {type: String, required: false}
});

export { IMeintagstruktur, Meintagshema };
