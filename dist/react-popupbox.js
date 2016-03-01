'use strict';

var React = require('react');
var React__default = 'default' in React ? React['default'] : React;
var lodash = require('lodash');
var classNames = require('classnames');
classNames = 'default' in classNames ? classNames['default'] : classNames;

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

var PopModal = function (_Component) {
  babelHelpers.inherits(PopModal, _Component);

  function PopModal(props) {
    babelHelpers.classCallCheck(this, PopModal);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PopModal).call(this, props));

    var defaultConfig = {
      enable: false,
      closeButton: true,
      closeText: '✕',
      position: 'top'
    };

    _this.state = lodash.merge({}, defaultConfig, _this.props.titleBar, {
      callback: {}
    });
    return _this;
  }

  babelHelpers.createClass(PopModal, [{
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      if (this.props.display && e.keyCode === 27) {
        this.props.closePopupbox();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this.onKeyDown.bind(this, e));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeyDown.bind(this, e));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.show !== nextProps.show) {
        this.cleanUp();

        var fadeIn = nextProps.fadeIn;
        var fadeOut = nextProps.fadeOut;

        if (nextProps.show) {
          (function () {
            var _props = _this2.props;
            var onOpen = _props.onOpen;
            var onComplete = _props.onComplete;

            onOpen && onOpen();
            _this2.setState({
              transition: fadeIn ? 'all ' + lodash.get(nextProps, 'fadeInSpeed', 1000) / 1000 + 's' : 'none',
              callback: setTimeout(function () {
                onComplete && onComplete();
              }, lodash.get(nextProps, 'fadeInSpeed', 0) + 1)
            });
          })();
        } else {
          (function () {
            var _props2 = _this2.props;
            var onCleanup = _props2.onCleanup;
            var onClosed = _props2.onClosed;

            onCleanup && onCleanup();
            _this2.setState({
              transition: fadeOut ? 'all ' + lodash.get(nextProps, 'fadeOutSpeed', 1000) / 1000 + 's' : 'none',
              callback: setTimeout(function () {
                onClosed && onClosed();
              }, lodash.get(nextProps, 'fadeOutSpeed', 0) + 1)
            });
          })();
        }
      }
    }
  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      clearTimeout(this.state.callback);
    }
  }, {
    key: 'renderTitleBar',
    value: function renderTitleBar() {
      var _state = this.state;
      var className = _state.className;
      var text = _state.text;
      var closeText = _state.closeText;
      var closeButton = _state.closeButton;
      var closeButtonClassName = _state.closeButtonClassName;
      var closePopupbox = this.props.closePopupbox;

      var titleBarClass = {};
      if (className) {
        titleBarClass[className] = titleBarClass;
      }

      return React__default.createElement(
        'div',
        { id: 'popupbox-titleBar', className: classNames(titleBarClass) },
        React__default.createElement(
          'span',
          null,
          text && text.length ? text : React__default.createElement('br', null)
        ),
        closeButton && React__default.createElement(
          'button',
          {
            id: 'popupbox-btn--close',
            onClick: closePopupbox,
            className: closeButtonClassName },
          closeText
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var titleBar = this.state;
      var _props3 = this.props;
      var overlayOpacity = _props3.overlayOpacity;
      var show = _props3.show;
      var children = _props3.children;
      var closePopupbox = _props3.closePopupbox;
      var className = _props3.className;

      return React__default.createElement(
        'div',
        { id: 'popupbox',
          'data-type': 'popup',
          'data-title': titleBar.enable ? titleBar.position : null,
          style: { transition: this.state.transition },
          className: classNames({ 'is-active': show }) },
        React__default.createElement(
          'div',
          { id: 'popupbox-wrapper', className: className },
          titleBar.enable && this.renderTitleBar(),
          React__default.createElement(
            'div',
            { id: 'popupbox-content' },
            children
          )
        ),
        React__default.createElement('div', { id: 'popupbox-overlay', style: { opacity: overlayOpacity }, onClick: closePopupbox })
      );
    }
  }]);
  return PopModal;
}(React.Component);

var PopTrigger = function (_Component2) {
  babelHelpers.inherits(PopTrigger, _Component2);

  function PopTrigger() {
    babelHelpers.classCallCheck(this, PopTrigger);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PopTrigger).apply(this, arguments));
  }

  babelHelpers.createClass(PopTrigger, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var childProps = {};
      Object.keys(this.props).map(function (key) {
        if (key !== 'children' && key !== 'openPopupbox' && key !== 'className') {
          childProps[key] = _this4.props[key];
        } else if (key === 'openPopupbox') {
          childProps['onClick'] = _this4.props[key];
        }
      });
      return React.cloneElement(this.props.children, childProps);
    }
  }]);
  return PopTrigger;
}(React.Component);

var PopupboxModal = PopModal;
var PopupboxTrigger = PopTrigger;

var Popupbox = function (_Component) {
  babelHelpers.inherits(Popupbox, _Component);

  function Popupbox(props) {
    babelHelpers.classCallCheck(this, Popupbox);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Popupbox).call(this, props));

    var defaultConfig = {
      overlayOpacity: 0.75,
      show: false,
      fadeIn: false,
      fadeInSpeed: 500,
      fadeOut: true,
      fadeOutSpeed: 500
    };

    _this.state = lodash.merge({}, defaultConfig, lodash.omit(_this.props, 'children'));
    return _this;
  }

  babelHelpers.createClass(Popupbox, [{
    key: 'openPopupbox',
    value: function openPopupbox() {
      this.setState({ show: true });
    }
  }, {
    key: 'closePopupbox',
    value: function closePopupbox() {
      this.setState({ show: false });
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _this2 = this;

      var children = this.props.children;

      var childrenSource = children.length > 1 ? children : new Array(children);
      return childrenSource.map(function (child, index) {
        var childProps = babelHelpers.extends({
          key: index,
          openPopupbox: _this2.openPopupbox.bind(_this2),
          closePopupbox: _this2.closePopupbox.bind(_this2)
        }, _this2.state);
        for (var j in _this2.state) {
          childProps[j] = _this2.state[j];
        }
        return React.cloneElement(child, childProps);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React__default.createElement(
        'div',
        null,
        this.renderChildren()
      );
    }
  }]);
  return Popupbox;
}(React.Component);

exports.PopupboxModal = PopupboxModal;
exports.PopupboxTrigger = PopupboxTrigger;
exports.Popupbox = Popupbox;