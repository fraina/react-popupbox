React Popupbox
===========================

[![npm](https://img.shields.io/npm/l/express.svg?style=flat)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/react-popupbox.svg?style=flat)](https://www.npmjs.com/package/react-popupbox)

A simple lightbox component for react, inspired by [colorbox](https://github.com/jackmoore/colorbox) and [React-Lightbox](https://github.com/howtomakeaturn/React-Lightbox).

See [demo & usage](http://fraina.github.io/react-popupbox/).

## Install

Install via npm:
```
$ npm install react-popupbox
```

## Styles

In order to bring in the styles, import the `css` file:
```
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
```

## Development Notes

`<PopupboxContainer />` should only be mounted once in your application (near the root of your component tree, avoid using in deeply nested children, `Array.map` returns etc.). Improperly placed or multiple PopupboxContainers can lead to unnecessary unmounting of the component and `Warning: Can't perform a React state update on an unmounted component` errors.

To display different popups throughout the app, simply change the content passed to PopupboxManager.open({ content: <p>My unique content!</p> }) call each time.

## License
MIT
