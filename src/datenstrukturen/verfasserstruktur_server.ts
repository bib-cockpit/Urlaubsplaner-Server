import mongoose from "mongoose";

interface IVerfasserstruktur {

    Email:       string;
    Vorname:     string;
    Name:        string;
};

const Verfassershema = new mongoose.Schema({

  _id:     false,
  Vorname: {type: String, required: false},
  Name:    {type: String, required: false},
  Email:   {type: String, required: false}
});

export { IVerfasserstruktur, Verfassershema };
