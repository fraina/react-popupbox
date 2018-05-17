import { EventEmitter } from 'events'
import merge from 'deepmerge'

const Constants = {
  OPEN: 'open',
  CLOSE: 'close',
  CHANGE: 'change'
}

class Manager extends EventEmitter {
  constructor() {
    super()
    this.content = null
    this.config = {}
    this.show = false

    this._defaultConfig = null

    this.open = this.open.bind(this)
    this.update = this.update.bind(this)
    this.close = this.close.bind(this)
  }

  setDefault(defaultConfig) {
    this._defaultConfig = defaultConfig
  }

  open({ content = null, config = {} }) {
    if (!content) {
      console.warn('[popupbox.open] parameter \'content\' is required.')
      return false
    }
    this.content = content || null
    this.config = config || this._defaultConfig
    this.show = true
    this.emitChange()
  }

  update({ content = null, config = {} }) {
    this.content = content || this.content
    this.config = merge(this.config, config)
    this.emitChange()
  }

  close() {
    this.show = false
    this.emitChange()
  }

  emitChange() {
    this.emit(Constants.CHANGE, {
      children: this.content,
      config: this.config,
      show: this.show
    })
  }

  addChangeListener(callback) {
    this.addListener(Constants.CHANGE, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback)
  }
}

export default new Manager()
