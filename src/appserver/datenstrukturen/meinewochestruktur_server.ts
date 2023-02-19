import mongoose from "mongoose";

interface IMeinewochestruktur  {

  ProjektID:           string;
  ProjektpunktID:      string;
  Projektkey:          string;

  Montagseinsatz:     boolean;
  Dienstagseinsatz:   boolean;
  Mittwochseinsatz:  boolean;
  Donnerstagseinsatz: boolean;
  Freitagseinsatz:    boolean;
  Samstagseinsatz:    boolean;

  Montagsstunden:     number;
  Dienstagsstunden:   number;
  Mittwochsstunden:   number;
  Donnerstagsstunden: number;
  Freitagsstunden:    number;
  Samstagsstunden:    number;

  Montagsminuten:     number;
  Dienstagsminuten:   number;
  Mittwochsminuten:   number;
  Donnerstagsminuten: number;
  Freitagsminuten:    number;
  Samstagsminuten:    number;
};

const Meinewocheshema = new mongoose.Schema({

  _id:            false,
  ProjektID:      {type: String, required: false},
  Projektkey:     {type: String, required: false},
  ProjektpunktID: {type: String, required: false},

  Montagseinsatz:     {type: Boolean, required: false},
  Dienstagseinsatz:   {type: Boolean, required: false},
  Mittwochseinsatz:  {type: Boolean, required: false},
  Donnerstagseinsatz: {type: Boolean, required: false},
  Freitagseinsatz:    {type: Boolean, required: false},
  Samstagseinsatz:    {type: Boolean, required: false},

  Montagsstunden:     {type: Number, required: false},
  Dienstagsstunden:   {type: Number, required: false},
  Mittwochsstunden:   {type: Number, required: false},
  Donnerstagsstunden: {type: Number, required: false},
  Freitagsstunden:    {type: Number, required: false},
  Samstagsstunden:    {type: Number, required: false},

  Montagsminuten:     {type: Number, required: false},
  Dienstagsminuten:   {type: Number, required: false},
  Mittwochsminuten:   {type: Number, required: false},
  Donnerstagsminuten: {type: Number, required: false},
  Freitagsminuten:    {type: Number, required: false},
  Samstagsminuten:    {type: Number, required: false}
});

export { IMeinewochestruktur, Meinewocheshema };
