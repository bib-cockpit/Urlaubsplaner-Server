import * as mongoose from "mongoose";
import {IOutlookemailadressstruktur, Outlookemailadressstrukturshema} from "./outlookemailadressstruktur_server";
import {IOutlookbodystruktur, Outlookemailbodystrukturshema} from "./outlookemailbodystruktur_server";

interface IOutlookemailstruktur  {

  id: string;
  _id?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  Zeitstempel?: number;
  Zeitstring?: string;
  ProjektID?:   string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview:    string;
  importance:     string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: string;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body:   IOutlookbodystruktur;
  sender: IOutlookemailadressstruktur;
  from:   IOutlookemailadressstruktur;
  toRecipients:  IOutlookemailadressstruktur[];
  ccRecipients:  IOutlookemailadressstruktur[];
  bccRecipients: IOutlookemailadressstruktur[];
  replyTo:       IOutlookemailadressstruktur[];
};

const Outlookemailshema = new mongoose.Schema({

  id:                         {type: String,   required: false},
  createdDateTime:            {type: String,   required: false},
  lastModifiedDateTime:       {type: String,   required: false},
  changeKey:                  {type: String,   required: false},
  categories:                 {type: [String], required: false},
  receivedDateTime:           {type: String,   default: false},
  Zeitstempel:                {type: Number,   default: false},
  Zeitstring:                 {type: String,   default: false},
  ProjektID:                  {type: String,   default: false},
  sentDateTime:               {type: String,   default: false},
  hasAttachments:             {type: Boolean,  default: false},
  internetMessageId:          {type: String,   default: false},
  subject:                    {type: String,   default: false},
  bodyPreview:                {type: String,   default: false},
  importance:                 {type: String,   default: false},
  parentFolderId:             {type: String,   default: false},
  conversationId:             {type: String,   default: false},
  conversationIndex:          {type: String,   default: false},
  isDeliveryReceiptRequested: {type: String,   default: false},
  isRead:                     {type: Boolean,  default: false},
  isDraft:                    {type: Boolean,  default: false},
  webLink:                    {type: String,   default: false},
  inferenceClassification:    {type: String,   default: false},
  body:   Outlookemailbodystrukturshema,
  sender: Outlookemailadressstrukturshema,
  from:   Outlookemailadressstrukturshema,
  toRecipients:  [Outlookemailadressstrukturshema],
  ccRecipients:  [Outlookemailadressstrukturshema],
  bccRecipients: [Outlookemailadressstrukturshema],
  replyTo:       [Outlookemailadressstrukturshema],
});

export { IOutlookemailstruktur, Outlookemailshema };

