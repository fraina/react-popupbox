import React, { Component, cloneElement } from 'react';
import { merge, omit } from 'lodash';

import { PopModal, PopTrigger } from './lib/popupbox';

export const PopupboxModal = PopModal;
export const PopupboxTrigger = PopTrigger;

export class Popupbox extends Component {
  constructor(props) {
    super(props);
    const defaultConfig = {
      overlayOpacity: 0.75,
      show: false,
      fadeIn: false,
      fadeInSpeed: 500,
      fadeOut: true,
      fadeOutSpeed: 500
    }

    this.state = merge({}, defaultConfig, omit(this.props, 'children'));
  }

  componentWillReceiveProps(nextProps) {
    this.state = merge({}, this.state, omit(nextProps, 'children'));
  }

  openPopupbox() {
    this.setState({ show: true });
  }

  closePopupbox() {
    this.setState({ show: false });
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
