import mongoose from "mongoose";

interface IUrlaubsstruktur  {

  Startstempel: number;
  Endestempel:  number;
  Jahr:         number;
  VertreterID:  string;
  Startstring:  string;
  Endestring:   string;
  Status:       string;
};

const Urlaubsshema = new mongoose.Schema({

  Startstempel:   {type: Number,   required: false},
  Endestempel:    {type: Number,   required: false},
  Jahr:           {type: Number,   required: false},
  VertreterID:    {type: String,   required: false},
  Startstring:    {type: String,   required: false},
  Endestring:     {type: String,   required: false},
  Status:         {type: String,   required: false},

}, {_id: false});

export { IUrlaubsstruktur, Urlaubsshema };
