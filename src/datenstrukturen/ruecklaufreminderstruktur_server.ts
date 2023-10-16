import mongoose from "mongoose";
import {IVerfasserstruktur, Verfassershema} from "./verfasserstruktur_server";

interface IRuecklaufreminderstruktur  {

  Zeitstempel: number;
  Zeitstring:  string;
  Verfasser: IVerfasserstruktur;
};

const Ruecklaufremindershema = new mongoose.Schema({

  Zeitstring:            {type: String, required: false},
  Zeitstempel:           {type: Number, required: false},
  Verfasser:             Verfassershema,
});

export { IRuecklaufreminderstruktur, Ruecklaufremindershema };
