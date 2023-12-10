import mongoose from "mongoose";

interface IUrlaubprojektbeteiligtestruktur  {

  Display: boolean;
  MitarbeiterID: string;
};

const Urlaubprojektbeteiligteshema = new mongoose.Schema({

  Display:       {type: Boolean, required: false},
  MitarbeiterID: {type: String,  required: false}

}, {_id: false});

export { IUrlaubprojektbeteiligtestruktur, Urlaubprojektbeteiligteshema };
