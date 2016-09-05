'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var lodash = require('lodash');
var classNames = _interopDefault(require('classnames'));
var events = require('events');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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

var inherits = function (subClass, superClass) {
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

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Constants = {
  OPEN: 'open',
  CLOSE: 'close',
  CHANGE: 'change'
};

var Manager = function (_EventEmitter) {
  inherits(Manager, _EventEmitter);

  function Manager() {
    classCallCheck(this, Manager);

    var _this = possibleConstructorReturn(this, (Manager.__proto__ || Object.getPrototypeOf(Manager)).call(this));

    _this.content = null;
    _this.config = {};
    _this.show = false;

    _this._defaultConfig = null;
    return _this;
  }

  createClass(Manager, [{
    key: 'setDefault',
    value: function setDefault(defaultConfig) {
      this._defaultConfig = defaultConfig;
    }
  }, {
    key: 'open',
    value: function open(params) {
      var content = params.content;
      var config = params.config;

      this.content = content || null;
      this.config = config || this._defaultConfig;
      this.show = true;
      this.emitChange();
    }
  }, {
    key: 'close',
    value: function close() {
      this.show = false;
      this.emitChange();
    }
  }, {
    key: 'emitChange',
    value: function emitChange() {
      this.emit(Constants.CHANGE, {
        children: this.content,
        config: this.config,
        show: this.show
      });
    }
  }, {
    key: 'addChangeListener',
    value: function addChangeListener(callback) {
      this.addListener(Constants.CHANGE, callback);
    }
  }, {
    key: 'removeChangeListener',
    value: function removeChangeListener(callback) {
      this.removeListener(Constants.CHANGE, callback);
    }
  }]);
  return Manager;
}(events.EventEmitter);

var Manager$1 = new Manager();

var Container = function (_Component) {
  inherits(Container, _Component);

  function Container(props) {
    classCallCheck(this, Container);

    var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

    _this._defaultState = _this.getConfig();
    _this.state = _this._defaultState;
    Manager$1.setDefault(_this._defaultState);

    _this.handleStoreChange = _this.handleStoreChange.bind(_this);
    _this.closeImagebox = Manager$1.close.bind(Manager$1);
    return _this;
  }

  createClass(Container, [{
    key: 'getConfig',
    value: function getConfig() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      var defaultConfig = {
        overlayOpacity: 0.75,
        show: false,
        fadeIn: false,
        fadeInSpeed: 500,
        fadeOut: true,
        fadeOutSpeed: 500
      };

      var defaultTitlebarConfig = {
        enable: false,
        closeButton: true,
        closeText: '✕',
        position: 'top'
      };

      if (!params) return lodash.merge({}, defaultConfig, defaultTitlebarConfig);
      var _config = lodash.merge({}, defaultConfig, lodash.omit(params, ['children', 'lightbox']));
      return lodash.merge({}, _config, defaultTitlebarConfig, params.titleBar, {
        children: null,
        callback: {}
      });
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      if (this.state.show && e.keyCode === 27) {
        this.closeImagebox();
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      Manager$1.addChangeListener(this.handleStoreChange);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeyDown.bind(this));
      Manager$1.removeChangeListener(this.handleStoreChange);
    }
  }, {
    key: 'handleStoreChange',
    value: function handleStoreChange(params) {
      var _this2 = this;

      var children = params.children;
      var show = params.show;
      var config = params.config;


      if (this.state.show !== show) {
        this.cleanUp();

        var currentConfig = this.getConfig(config);
        var fadeIn = currentConfig.fadeIn;
        var fadeInSpeed = currentConfig.fadeInSpeed;
        var fadeOut = currentConfig.fadeOut;
        var fadeOutSpeed = currentConfig.fadeOutSpeed;

        if (show) {
          (function () {
            var _props = _this2.props;
            var onComplete = _props.onComplete;
            var onOpen = _props.onOpen;

            _this2.setState(lodash.merge({}, currentConfig, {
              children: children,
              show: true,
              transition: fadeIn ? 'all ' + fadeInSpeed / 1000 + 's ease-in-out' : 'none',
              callback: setTimeout(function () {
                onComplete && onComplete();
              }, fadeInSpeed + 1)
            }));
            onOpen && onOpen();
          })();
        } else {
          var onCleanUp = this.props.onCleanUp;

          onCleanUp && onCleanUp();
          this.setState({
            show: false,
            transition: fadeOut ? 'all ' + fadeOutSpeed / 1000 + 's ease-in-out' : 'none',
            callback: setTimeout(function () {
              _this2.onClosed();
            }, fadeOutSpeed + 1)
          });
        }
      }
    }
  }, {
    key: 'onClosed',
    value: function onClosed() {
      var onClosed = this.props.onClosed;

      onClosed && onClosed();
      this.setState(this._defaultState);
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


      var titleBarClass = {};
      if (className) {
        titleBarClass[className] = titleBarClass;
      }

      return React__default.createElement(
        'div',
        { className: classNames('popupbox-titleBar', titleBarClass) },
        React__default.createElement(
          'span',
          null,
          text && text.length ? text : React__default.createElement('br', null)
        ),
        closeButton && React__default.createElement(
          'button',
          {
            onClick: this.closeImagebox,
            className: classNames('popupbox-btn--close', closeButtonClassName) },
          closeText
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var titleBar = this.state;
      var _state2 = this.state;
      var overlayOpacity = _state2.overlayOpacity;
      var show = _state2.show;
      var children = _state2.children;
      var className = _state2.className;


      return React__default.createElement(
        'div',
        {
          'data-title': titleBar.enable ? titleBar.position : null,
          style: { transition: this.state.transition },
          className: classNames('popupbox', { 'is-active': show })
        },
        React__default.createElement(
          'div',
          { className: classNames('popupbox-wrapper', className) },
          titleBar.enable && this.renderTitleBar(),
          React__default.createElement(
            'div',
            { className: 'popupbox-content' },
            children
          )
        ),
        React__default.createElement('div', { className: 'popupbox-overlay', style: { opacity: overlayOpacity }, onClick: this.closeImagebox })
      );
    }
  }]);
  return Container;
}(React.Component);

var PopupboxContainer = Container;
var PopupboxManager = Manager$1;

exports.PopupboxContainer = PopupboxContainer;
exports.PopupboxManager = PopupboxManager;