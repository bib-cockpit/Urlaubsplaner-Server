import mongoose from "mongoose";
import {IUrlauzeitspannenstruktur, Urlaubszeitspannenshema} from "./urlauzeitspannenstruktur_server";

interface IUrlaubsstruktur  {

  Jahr:         number;
  Resturlaub:   number;
  FreigeberID:  string;
  Zeitspannen:  IUrlauzeitspannenstruktur[];
  Mitarbeiterliste: string[];
  Stellvertreterliste: string[];
  Ferienblockerliste: number[];
  Feiertageblockerliste: number[];
};

const Urlaubsshema = new mongoose.Schema({

  Jahr:                  {type: Number,   required: false},
  Resturlaub:            {type: Number,   required: false},
  FreigeberID:           {type: String,   required: false},
  Mitarbeiterliste:      {type: [String], required: false},
  Stellvertreterliste:   {type: [String], required: false},
  Ferienblockerliste:    {type: [Number], required: false},
  Feiertageblockerliste: {type: [Number], required: false},
  Zeitspannen:           [Urlaubszeitspannenshema]

}, {_id: false});

export { IUrlaubsstruktur, Urlaubsshema };
