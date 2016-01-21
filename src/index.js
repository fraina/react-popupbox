import React, { Component, cloneElement } from 'react';
import { merge, omit } from 'lodash';

export const { PopupboxModal, PopupboxTrigger } = require('./lib/popupbox');

export default class Popupbox extends Component {
  constructor(props) {
    super(props);
    const {
      overlayOpacity
    } = this.props;

    const defaultConfig = {
      overlayOpacity: 0.75,
      display: false,
      fadeIn: false,
      fadeInSpeed: 500,
      fadeOut: true,
      fadeOutSpeed: 500
    }

    this.state = merge({}, defaultConfig, omit(this.props, 'children'));
  }

  openPopupbox() {
    const { fadeIn } = this.state;
    this.setState({ display: true });
  }

  closePopupbox() {
    const { fadeOut } = this.state;
    this.setState({ display: false });
  }

  renderChildren() {
    const { children } = this.props;
    const childrenSource = (children.length > 1) ? children : new Array(children);
    return childrenSource.map((child, index) => {
      const childProps = {
        key: index,
        openPopupbox: this.openPopupbox.bind(this),
        closePopupbox: this.closePopupbox.bind(this),
        ...this.state
      }
      for (var j in this.state){
        childProps[j] = this.state[j];
      }
      return cloneElement(child, childProps);
    })
  }

  render() {
    return (
        <div>
          { this.renderChildren() }
        </div>
    );
  }
}
