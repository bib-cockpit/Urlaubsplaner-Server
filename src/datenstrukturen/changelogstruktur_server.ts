import mongoose from "mongoose";

interface IChangelogstruktur  {

  _id:          string;
  Beschreibung: string;
  Zeitstempel:  number;
  Version:      string;
  Deleted:      boolean;
};

const Changelogshema = new mongoose.Schema({

  Beschreibung: {type: String, required: false},
  Zeitstempel:  {type: Number, required: false},
  Version:      {type: String, required: false},
  Deleted:      {type: Boolean, default: false}

});

export { Changelogshema, IChangelogstruktur };
