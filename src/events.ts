import {EventEmitter} from 'events';

class Eventerweiterung extends EventEmitter {


  sendMessage(message) {

    this.emit('Eventname', { message: message } );
  }
}

export { Eventerweiterung };
