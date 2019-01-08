ShowModalDialog Polyfill
========================

This is a `window.showModalDialog()` shim using a modal HTML5 `<dialog>` element and ECMAScript 2015 Generators or ECMAScript 2017 Async/Await. It was tested in the latest Google Chrome and in the latest Mozilla Firefox with the *dom.dialog_element.enabled* preference set to *true* in `about:config`. Just include the following HTML code before using `showModalDialog` function:

    <script src="https://unpkg.com/showmodaldialog"></script>

Passing both `window.dialogArguments` and `window.returnValue` is supported, provided that the dialog document is on the same server as the host document.

ShowModalDialog Polyfill is using Promises, Generators, `yield`, `async`, `await` and the [`spawn` function](https://gist.github.com/jakearchibald/31b89cba627924972ad6) by Jake Archibald. If they are unavailable, the polyfill is using `eval` and JSON as a fallback, provided that statements are separated by new lines, the `showModalDialog` function is not nested and runs only once in a function.

Syntax
------

```javascript
spawn(function*() {

    //statements before showing a modal dialog

    var returnValue = yield window.showModalDialog( url [, arguments, options] );

    //statements after closing a modal dialog

});
```

or:

```javascript
(async function() {

    //statements before showing a modal dialog

    var returnValue = await window.showModalDialog( url [, arguments, options] );

    //statements after closing a modal dialog

})();
```

or:

```javascript
(function() {

    //statements before showing a modal dialog

    var returnValue = window.showModalDialog( url [, arguments, options] );

    //statements after closing a modal dialog

})();
```

where:

 - *url* - a string that specifies the URL of the document to load and display;
 - *arguments* - a variant that specifies the arguments to use when displaying the document;
 - *options* - a string that specifies the dialog box style, using CSS or the following semicolon-delimited attributes: `dialogHeight:???px;dialogLeft:???px;dialogTop:???px;dialogWidth:???px;`

When using generators or async/await, both `showModalDialog` and `spawn` functions are Promises, so you can use their `then` method and `yield` them.

When using an `eval` fallback, the `showModalDialog` function throws an exception to stop executing code until the modal is closed, then it `eval`s the remaining code of a caller function.

In order to close the dialog from inside of it, invoke `parent.document.getElementsByTagName('dialog')[0].close();` provided that both documents have the same origin. 

Demo
----

[Here is a live demo](http://niutech.github.com/showModalDialog/demo.html). Works best in Google Chrome.

License
-------

ShowModalDialog Polyfill is developed by Jerzy Głowacki under Apache 2.0 License.
