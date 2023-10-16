import {DebugClass} from "./debug";

export class Toolsclass {

  private Debug: DebugClass;

  constructor() {

    this.Debug = new DebugClass();
  }

  public FormatLinebreaks(text: string): string {

    try {

      if(typeof text !== 'undefined') {

        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      }
      else {

        return '';
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, error, 'SendBautagebuchroutsClass', 'FormatLinebreaks');
    }
  }
}
