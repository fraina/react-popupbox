import React, { Component } from 'react'
import Manager from './manager'
import merge from 'deepmerge'

export class Container extends Component {
  constructor(props) {
    super(props)

    this._defaultState = this.getConfig({ params: props, isInit: true })
    this.state = this._defaultState
    Manager.setDefault(this._defaultState)

    this.handleStoreChange = this.handleStoreChange.bind(this)
    this.closeImagebox = Manager.close.bind(Manager)
  }

  getConfig({ params, isInit }) {
    const defaultConfig = isInit ? {
      overlayOpacity: 0.75,
      show: false,
      fadeIn: false,
      fadeInSpeed: 500,
      fadeOut: true,
      fadeOutSpeed: 500,
      overlayClose: true
    } : this._defaultState

    const defaultTitlebarConfig = {
      enable: false,
      closeButton: true,
      closeText: '✕',
      position: 'top'
    }

    if (!params) return merge(defaultConfig, defaultTitlebarConfig)

    const cleanUpParams = (() => {
      const ret = params
      delete ret.children
      delete ret.lightbox
      return ret
    })()

    const _mergedConfig = merge(defaultConfig, params)
    const _mergedTitlebarConfig = merge(defaultTitlebarConfig, params.titleBar || {})

    delete _mergedConfig.titleBar
    return merge(_mergedConfig, _mergedTitlebarConfig)
  }

  onKeyDown(e) {
    if (this.state.show && (e.keyCode === 27)) {
      this.closeImagebox()
    }
  }

  componentWillMount() {
    Manager.addChangeListener(this.handleStoreChange)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this))
    Manager.removeChangeListener(this.handleStoreChange)
  }

  handleStoreChange(params) {
    this.cleanUp()

    const { children, show, config } = params
    const currentConfig = this.getConfig({ params: config, isInit: false })
    const { fadeIn, fadeInSpeed, fadeOut, fadeOutSpeed } = currentConfig

    if (show) {
      const { onComplete, onOpen } = this.props
      this.setState(merge(currentConfig, {
        children: children,
        show: true,
        transition: (fadeIn) ? `all ${fadeInSpeed / 1000}s ease-in-out` : 'none',
        callback: setTimeout(() => {
          onComplete && onComplete()
        }, fadeInSpeed + 1)
      }))
      onOpen && onOpen()
    } else {
      const { onCleanUp } = this.props
      onCleanUp && onCleanUp()
      this.setState({
        show: false,
        transition: (fadeOut) ? `all ${fadeOutSpeed / 1000}s ease-in-out` : 'none',
        callback: setTimeout(() => {
          this.onClosed()
        }, fadeOutSpeed + 1)
      })
    }
  }

  onClosed() {
    const { onClosed } = this.props
    onClosed && onClosed()
    this.setState(this._defaultState)
  }

  cleanUp() {
    clearTimeout(this.state.callback)
  }

  renderTitleBar() {
    const { className, text, closeText, closeButton, closeButtonClassName } = this.state

    const titleBarClass = {}
    if (className) {
      titleBarClass[className] = titleBarClass
    }

    return (
      <div className={`popupbox-titleBar ${titleBarClass}`}>
        <span>{ (text && text.length) ? text : <br /> }</span>
        { closeButton &&
          <button
            onClick={this.closeImagebox}
            className={`popupbox-btn--close ${closeButtonClassName}`}>
            { closeText }
          </button>
        }
      </div>
    )
  }

  render() {
    const titleBar = this.state
    const {
      overlayOpacity,
      show,
      children,
      className
    } = this.state

    return (
      <div
        data-title={ (titleBar.enable) ? titleBar.position : null }
        style={{ transition: this.state.transition }}
        className={`popupbox ${show && 'is-active'}`}
      >
        <div className={`popupbox-wrapper ${className}`}>
          { titleBar.enable && this.renderTitleBar() }
          <div className="popupbox-content">
            { children }
          </div>
        </div>
        <div className="popupbox-overlay" style={{ opacity: overlayOpacity }} onClick={ this.state.overlayClose && this.closeImagebox } />
      </div>
    )
  }
}
