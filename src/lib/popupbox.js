import React, { Component, cloneElement } from 'react';
import { get, merge } from 'lodash';
import classNames from 'classnames';

export class PopModal extends Component {
  constructor(props) {
    super(props);

    const defaultConfig = {
      enable: false,
      closeButton: true,
      closeText: '✕',
      position: 'top'
    };

    this.state = merge({}, defaultConfig, this.props.titleBar, {
      callback: {}
    });
  }

  onKeyDown(e) {
    if ((this.props.display) && (e.keyCode === 27)){
      this.props.closePopupbox();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.cleanUp();

      const { fadeIn, fadeOut } = nextProps;
      if (nextProps.show) {
        const { onOpen, onComplete } = this.props;
        onOpen && onOpen();
        this.setState({
          transition: (fadeIn) ? `all ${get(nextProps, 'fadeInSpeed', 1000) / 1000}s` : 'none',
          callback: setTimeout(() => {
            onComplete && onComplete();
          }, get(nextProps, 'fadeInSpeed', 0) + 1)
        });
      } else {
        const { onCleanup, onClosed } = this.props;
        onCleanup && onCleanup();
        this.setState({
          transition: (fadeOut) ? `all ${get(nextProps, 'fadeOutSpeed', 1000) / 1000}s` : 'none',
          callback: setTimeout(() => {
            onClosed && onClosed();
          }, get(nextProps, 'fadeOutSpeed', 0) + 1)
        })
      }
    }
  }

  cleanUp() {
    clearTimeout(this.state.callback);
  }

  renderTitleBar() {
    const { className, text, closeText, closeButton, closeButtonClassName } = this.state;
    const { closePopupbox } = this.props;

    const titleBarClass = {};
    if (className) {
      titleBarClass[className] = titleBarClass;
    }

    return (
      <div className={ classNames('popupbox-titleBar', titleBarClass) }>
        <span>{ (text && text.length) ? text : <br /> }</span>
        { closeButton &&
          <button
            onClick={closePopupbox}
            className={classNames('popupbox-btn--close', closeButtonClassName)}>
            { closeText }
          </button>
        }
      </div>
    )
  }

  render() {
    const titleBar = this.state;
    const {
      overlayOpacity,
      show,
      children,
      closePopupbox,
      className
    } = this.props;

    return (
      <div data-type="popup"
        data-title={ (titleBar.enable) ? titleBar.position : null }
        style={{ transition: this.state.transition }}
        className={ classNames('popupbox', { 'is-active': show }) }>
        <div className={ classNames('popupbox-wrapper', className)}>
          { titleBar.enable && this.renderTitleBar() }
          <div className="popupbox-content">
            { children }
          </div>
        </div>
        <div className="popupbox-overlay" style={{ opacity: overlayOpacity }} onClick={ closePopupbox } />
      </div>
    );
  }
}

export class PopTrigger extends Component {
  render() {
    const childProps = {};
    Object.keys(this.props).map((key) => {
      if (key !== 'children' && key !== 'openPopupbox' && key !== 'className') {
        childProps[key] = this.props[key];
      } else if (key === 'openPopupbox') {
        childProps['onClick'] = this.props[key];
      }
    })
    return cloneElement(this.props.children, childProps);
  }
}
