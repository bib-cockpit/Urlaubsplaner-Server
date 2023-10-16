
import {Favoritenshema, IFavoritenstruktur} from "./favoritenstruktur_server";
import mongoose from "mongoose";
import {IMeintagstruktur, Meintagshema} from "./meintagstruktur_server";
import {IMeinewochestruktur, Meinewocheshema} from "./meinewochestruktur_server";

interface IMitarbeiterstruktur  {

    _id: string;
    UserID:     string;
    StandortID: string;
    Jobtitel:   string;
    Location:   string;
    Vorname: string;
    Name: string;
    Kuerzel: string;
    SettingsID: string;
    Telefon: string;
    Mobil: string;
    Email: string;
    Zeitstring: string;
    Zeitstempel: number;
    Fachbereich: string;
    Deleted:        boolean;
    Favoritenliste: IFavoritenstruktur[];
    Meintagliste:   IMeintagstruktur[];
    Meinewocheliste: IMeinewochestruktur[];
    Archiviert: boolean;
};

const Mitarbeitershema = new mongoose.Schema({

  UserID:         {type: String, required: false},
  StandortID:     {type: String, required: false},
  Vorname:        {type: String, required: false},
  Name:           {type: String, required: false, index: true },
  Location:       {type: String, required: false},
  Jobtitel:       {type: String, required: false},
  Kuerzel:        {type: String, required: false},
  SettingsID:     {type: String, required: false},
  Telefon:        {type: String, required: false},
  Mobil:          {type: String, required: false},
  Email:          {type: String, required: true, unique: true },
  Zeitstring:     {type: String, required: false},
  Zeitstempel:    {type: Number, required: false},
  Fachbereich:    {type: String, required: false},
  Deleted:        {type: Boolean, default: false},
  Archiviert:     {type: Boolean, default: false},

  Favoritenliste:  [Favoritenshema],
  Meintagliste:    [Meintagshema],
  Meinewocheliste: [Meinewocheshema]
});

export { Mitarbeitershema, IMitarbeiterstruktur };
