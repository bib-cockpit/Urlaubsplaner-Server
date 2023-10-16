import mongoose from "mongoose";

interface IOutlookbodystruktur  {
  contentType: string; // "47987_herzo",
  content:     string; // "47987_herzo@pinovaplan.com"

};

const Outlookemailbodystrukturshema = new mongoose.Schema({

  contentType: {type: String,  required: false},
  content:     {type: String,  required: false},


});

export { IOutlookbodystruktur, Outlookemailbodystrukturshema };
