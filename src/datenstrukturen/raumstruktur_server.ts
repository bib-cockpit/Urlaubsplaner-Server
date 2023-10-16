import mongoose from "mongoose";

interface IRaumstruktur   {

  RaumID:         string;
  Raumnummer:     string;
  Raumname:       string;
  Listenposition: number;
};

const Raumshema = new mongoose.Schema({

  _id:              false,
  RaumID:         {type: String,  required: false},
  Raumnummer:     {type: String,  required: false},
  Raumname:       {type: String,  required: false},
  Listenposition: {type: Number,  required: false},

});

export { IRaumstruktur, Raumshema };
