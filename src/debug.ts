
import { createLogger, transports, format, Logger } from "winston";

export class DebugClass {

  public Typen = {

    Class: 'Class'
  };

  public Debugliste: string[];
  public DebugLogger: Logger;

  constructor(){

    try {

      this.Debugliste  = [];
      this.DebugLogger = createLogger({
        transports: [
          new transports.Console({
            level: 'debug'
          }),
          new transports.File({
            dirname: "logs",
            level: 'error',
            filename: "logliste.log",
          }),
        ],
        format: format.combine(
          format.timestamp(),
          format.printf(({ timestamp, level, message, service }) => {
            return `[${timestamp}] ${service} ${level}: ${message}`;
          })
        ),
        defaultMeta: {
          service: "Debugger:",
        },
      });


    }
    catch (error) {

    }
  }

  public ShowErrorMessage(message, error, script, funktion)
  {
    try {

      this.DebugLogger.error(message + ' | ' + script + ' | ' + funktion, error);
      /*

      console.log('---------------------------------------------------------------------------');
      console.log('File:     ' + script);
      console.log('Function: ' + funktion);
      console.log('Typ:      ' + typ);
      console.log('Error:');
      console.log(error.message);
      console.log('---------------------------------------------------------------------------');

       */

    }
    catch (error2) {

      debugger;
    }
  }

  public ShowInfoMessage(message: any, script: string, funktion: string)
  {
    try {

      this.DebugLogger.debug(message + ' | ' + script + ' | ' + funktion);


      /*

      console.log('---------------------------------------------------------------------------');
      console.log('File:     ' + script);
      console.log('Function: ' + funktion);
      console.log('Typ:      ' + typ);
      console.log('Message:');
      console.log(message);
      console.log('---------------------------------------------------------------------------');

       */
    }
    catch (error) {

      debugger;
    }
  }



}
