ShowModalDialog Polyfill
========================

This is a `window.showModalDialog()` shim using a modal `<dialog>` element. It was tested in the latest Google Chrome. Just include the following HTML code before using that function: `<script src="showModalDialog.js"></script>`.

Passing both `window.dialogArguments` and `window.returnValue` is supported, provided that the dialog document is on the same server as the host document.

Syntax
------

`window.showModalDialog( url [, arguments, options, callback] )`

Where:

 - *url* - a string that specifies the URL of the document to load and display;
 - *arguments* - a variant that specifies the arguments to use when displaying the document;
 - *options* - a string that specifies the dialog box style, using CSS or the following semicolon-delimited attributes: *dialogHeight:???px;dialogLeft:???px;dialogTop:???px;dialogWidth:???px*;
  - *callback* - a function that is invoked after closing the dialog box, with a single parameter *returnValue*.

Demo
----

[Here is a live demo](http://niutech.github.com/showModalDialog/demo.html). Works in Google Chrome 37+.

License
-------

ShowModalDialog Polyfill is developed by Jerzy Głowacki under Apache 2.0 License.