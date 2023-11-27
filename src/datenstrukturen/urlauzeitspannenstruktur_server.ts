import mongoose from "mongoose";

interface IUrlauzeitspannenstruktur {

  Startstempel: number;
  Endestempel:  number;
  VertreterID:  string;
  Startstring:  string;
  Endestring:   string;
  Status:       string;
  Tageanzahl:   number;
};

const Urlaubszeitspannenshema = new mongoose.Schema({

  Startstempel:   {type: Number,   required: false},
  Endestempel:    {type: Number,   required: false},
  VertreterID:    {type: String,   required: false},
  Startstring:    {type: String,   required: false},
  Endestring:     {type: String,   required: false},
  Status:         {type: String,   required: false},
  Tageanzahl:     {type: Number,   required: false},

}, {_id: false});

export { IUrlauzeitspannenstruktur, Urlaubszeitspannenshema };
