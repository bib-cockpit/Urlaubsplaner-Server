import mongoose from "mongoose";
import {IUrlauzeitspannenstruktur, Urlaubszeitspannenshema} from "./urlauzeitspannenstruktur_server";
import {IUrlaubprojektbeteiligtestruktur, Urlaubprojektbeteiligteshema} from "./urlaubprojektbeteiligtestruktur_server";

interface IUrlaubsstruktur  {

  Jahr:         number;
  Resturlaub:   number;
  FreigeberID:  string;
  Zeitspannen:  IUrlauzeitspannenstruktur[];
  Projektbeteiligteliste: IUrlaubprojektbeteiligtestruktur[];
  Ferienblockerliste: number[];
  Feiertageblockerliste: number[];
};

const Urlaubsshema = new mongoose.Schema({

  Jahr:                  {type: Number,   required: false},
  Resturlaub:            {type: Number,   required: false},
  FreigeberID:           {type: String,   required: false},
  Projektbeteiligteliste:{type: [Urlaubprojektbeteiligteshema], required: false},
  Ferienblockerliste:    {type: [Number], required: false},
  Feiertageblockerliste: {type: [Number], required: false},
  Zeitspannen:           [Urlaubszeitspannenshema]

}, {_id: false});

export { IUrlaubsstruktur, Urlaubsshema };
