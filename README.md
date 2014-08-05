ShowModalDialog Polyfill
========================

This is a `window.showModalDialog()` shim using a modal HTML5 `<dialog>` element and ECMAScript 6 Generators. It was tested in the latest Google Chrome with the *Enable Experimental JavaScript* flag enabled in `chrome://flags/#enable-javascript-harmony`. Just include the following HTML code before using `showModalDialog` function: `<script src="showModalDialog.js"></script>`.

Passing both `window.dialogArguments` and `window.returnValue` is supported, provided that the dialog document is on the same server as the host document.

ShowModalDialog Polyfill is using Promises, Generators, the `yield` keyword and the [`spawn` function](https://gist.github.com/jakearchibald/31b89cba627924972ad6) by Jake Archibald. An old version using a callback function is still available.

Syntax
------

```javascript
spawn(function*() {

    //statements before showing a modal dialog

    var returnValue = yield window.showModalDialog( url [, arguments, options] );

    //statements after closing a modal dialog

});
```

Where:

 - *url* - a string that specifies the URL of the document to load and display;
 - *arguments* - a variant that specifies the arguments to use when displaying the document;
 - *options* - a string that specifies the dialog box style, using CSS or the following semicolon-delimited attributes: `dialogHeight:???px;dialogLeft:???px;dialogTop:???px;dialogWidth:???px`;

Demo
----

[Here is a live demo](http://niutech.github.com/showModalDialog/demo.html). Works in Google Chrome 37+ with the *Enable Experimental JavaScript* flag.

License
-------

ShowModalDialog Polyfill is developed by Jerzy Głowacki under Apache 2.0 License.
