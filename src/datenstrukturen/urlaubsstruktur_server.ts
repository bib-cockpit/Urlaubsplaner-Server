import mongoose from "mongoose";
import {IUrlauzeitspannenstruktur, Urlaubszeitspannenshema} from "./urlauzeitspannenstruktur_server";

interface IUrlaubsstruktur  {

  Jahr:         number;
  Resturlaub:   number;
  Zeitspannen:  IUrlauzeitspannenstruktur[];
};

const Urlaubsshema = new mongoose.Schema({

  Jahr:           {type: Number,   required: false},
  Resturlaub:     {type: Number,   required: false},
  Zeitspannen:    [Urlaubszeitspannenshema]

}, {_id: false});

export { IUrlaubsstruktur, Urlaubsshema };
