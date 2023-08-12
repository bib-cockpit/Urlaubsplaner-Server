import mongoose from "mongoose";

interface IOutlookemailadressstruktur  {

  emailAddress: {
    name:    string;
    address: string;
  };
};

const Outlookemailadressstrukturshema = new mongoose.Schema({

  emailAddress: {

    name:    {type: String,  required: false},
    address: {type: String,  required: false},
  }

});

export { IOutlookemailadressstruktur, Outlookemailadressstrukturshema };
