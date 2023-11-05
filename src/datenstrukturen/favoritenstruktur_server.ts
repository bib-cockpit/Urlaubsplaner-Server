import mongoose from "mongoose";

interface IFavoritenstruktur {

  FavoritenID:   string;
  Name:          string;
  Projekteliste: string[];
};

const Favoritenshema = new mongoose.Schema({

  FavoritenID:   {type: String,   required: false},
  Name:          {type: String,   required: false},
  Projekteliste: {type: [String], required: false},
}, {_id: false});

export { IFavoritenstruktur, Favoritenshema };
