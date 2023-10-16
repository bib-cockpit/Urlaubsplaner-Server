import mongoose from "mongoose";

interface IAufgabenansichtstruktur  {

  ProjektID: string;
  AufgabenShowOffen:           boolean;
  AufgabenShowGeschlossen:     boolean;
  AufgabenShowBearbeitung:     boolean;
  AufgabenShowRuecklauf:       boolean;
  AufgabenShowBilder:          boolean;
  AufgabenShowMeilensteinOnly: boolean;
  AufgabenShowPlanung:         boolean;
  AufgabenShowAusfuehrung:     boolean;
  AufgabenShowMeilensteine:    boolean;
};

const Aufgabenansichtshema = new mongoose.Schema({

  ProjektID:                   {type: String,  required: false},
  AufgabenShowOffen:           {type: Boolean, required: false},
  AufgabenShowGeschlossen:     {type: Boolean, required: false},
  AufgabenShowBearbeitung:     {type: Boolean, required: false},
  AufgabenShowRuecklauf:       {type: Boolean, required: false},
  AufgabenShowBilder:          {type: Boolean, required: false},
  AufgabenShowMeilensteinOnly: {type: Boolean, required: false},
  AufgabenShowPlanung:         {type: Boolean, required: false},
  AufgabenShowAusfuehrung:     {type: Boolean, required: false},
  AufgabenShowMeilensteine:    {type: Boolean, required: false},
});

export { IAufgabenansichtstruktur, Aufgabenansichtshema };
