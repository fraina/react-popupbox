import { EventEmitter } from 'events';

const Constants = {
  OPEN: 'open',
  CLOSE: 'close',
  CHANGE: 'change'
}

class Manager extends EventEmitter {
  constructor() {
    super();
    this.content = null;
    this.config = {};
    this.show = false;

    this._defaultConfig = null;
  }

  setDefault(defaultConfig) {
    this._defaultConfig = defaultConfig
  }

  open(params) {
    const { content, config } = params;
    this.content = content || null;
    this.config = config || this._defaultConfig;
    this.show = true;
    this.emitChange();
  }

  close() {
    this.show = false;
    this.emitChange();
  }

  emitChange() {
    this.emit(Constants.CHANGE, {
      children: this.content,
      config: this.config,
      show: this.show
    });
  }

  addChangeListener(callback) {
    this.addListener(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new Manager();
