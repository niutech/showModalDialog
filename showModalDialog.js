(function() {
    // All references to document object will be on top window
    var dialogDocument = window.top.document;

    window.spawn = window.spawn || function(gen) {
        function continuer(verb, arg) {
            var result;
            try {
                result = generator[verb](arg);
            } catch (err) {
                return Promise.reject(err);
            }
            if (result.done) {
                return result.value;
            } else {
                return Promise.resolve(result.value).then(onFulfilled, onRejected);
            }
        }
        var generator = gen();
        var onFulfilled = continuer.bind(continuer, 'next');
        var onRejected = continuer.bind(continuer, 'throw');
        return onFulfilled();
    };

    // Override window.close function to close the last dialog created,
    // if window.shoModalDialog function doesn't exist
    window.close = window.showModalDialog ? window.close : function(close) {
        return function() {
            var dialogTags = dialogDocument.getElementsByTagName('dialog');
            var dialog = dialogTags[dialogTags.length - 1];
            if (dialog)
                dialog.close();
            else
                return close.call();
        };
    }(window.close);

    // Override window.shoModalDialog function if doesn't exist
    window.showModalDialog = window.showModalDialog || function (url, arg, opt) {
        url = url || ''; //URL of a dialog
        arg = arg || null; //arguments to a dialog
        opt = opt || 'dialogWidth:300px;dialogHeight:200px'; //options: dialogTop;dialogLeft;dialogWidth;dialogHeight or CSS styles

        // To create an interface for the showModalDialog place showModalDialog.interface in a comment inside
        // e.g.: function showMaximizedDialog(url, args, options) { // showModalDialog.interface
        var callerName = (showModalDialog.caller + '').indexOf('showModalDialog.interface') > -1 ? showModalDialog.caller.name : 'showModalDialog';

        // If it's only an interface, call the caller from caller
        var caller = (callerName === 'showModalDialog' ? showModalDialog.caller : showModalDialog.caller.caller);
        var dialogTitle = 'dialog-title';
        caller = showModalDialog.caller.toString();
        var dialog = dialogDocument.body.appendChild(dialogDocument.createElement('dialog'));
        var lastDialog = dialogDocument.querySelectorAll('dialog')[dialogDocument.querySelectorAll('dialog').length - 1];
        dialog.setAttribute('style', opt.replace(/dialog/gi, ''));
        dialog.innerHTML = '<div id=' + dialogTitle + '>';
        dialog.innerHTML += '<span id="dialog-close"><a href="#">&times;</a></span>';
        dialog.innerHTML += '</div><iframe id="dialog-body" src="' + url + '"></iframe>';
        lastDialog.querySelector('#dialog-body').contentWindow.dialogArguments = arg;
        lastDialog.querySelector('#dialog-close').addEventListener('click', function (e) {
            e.preventDefault();
            dialog.close();
        });

        // --------------------------------------------------------------
        // Create the css part for the dialog
        if (!dialogDocument.getElementById('dialog-css')) {
            var css = '<!--' +
            'dialog {padding: calc(1.8em + 1px) 0 0 0;box-shadow: 0px 0px 25px 2px #aaa;border: 1px solid;position: fixed !important;}' +
            'dialog::backdrop {background: rgba(0, 0, 0, .2)}' +
            '#' + dialogTitle + ' {width: 100%;background-color: #395484;position: absolute;left: 0;top: 0;height: calc(1.8em + 1px);}' +
            '#dialog-close {-webkit-transition: .2s ease-in-out;-moz-transition: .2s ease-in-out;-o-transition: .2s ease-in-out;transition: .2s ease-in-out;' +
            'position: absolute; top: 1px; right: 1px; width: 1.8em; height: calc(1.8em - 1px);text-align: center;}' +
            '#dialog-close:hover {background-color: #D00;} -->' +
            '#dialog-close a {font-size: 20px; color: #FFF; text-decoration: none; outline: none;}' +
            '#dialog-body {border: 0; width: 100%; height: 100%;}' +
            '-->';
            
            var head = dialogDocument.head || dialogDocument.getElementsByTagName('head')[0];
            var style = dialogDocument.createElement('style');
            
            style.type = 'text/css';
            style.id = 'dialog-css';
            style.appendChild(dialogDocument.createTextNode(css));
            head.appendChild(style);
        }

        // --------------------------------------------------------------
        // Make the dialog draggable
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        dialog.querySelector('#' + dialogTitle).onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            dialogDocument.onmouseup = closeDragElement;
            // call a function whenever the cursor moves
            dialogDocument.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position
            dialog.style.top = (dialog.offsetTop - pos2) + "px";
            dialog.style.marginLeft = (dialog.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // stop moving when mouse button is released
            dialogDocument.onmouseup = null;
            dialogDocument.onmousemove = null;
        }

        dialog.showModal();

        //if using yield or async/await
        if (caller.indexOf('yield') >= 0 || caller.indexOf('await') >= 0) {
            return new Promise(function (resolve, reject) {
                dialog.addEventListener('close', function () {
                    var returnValue = lastDialog.querySelector('#dialog-body').contentWindow.returnValue;
                    dialogDocument.body.removeChild(dialog);
                    resolve(returnValue);
                });
            });
        }

        //if using eval
        var isNext = false;
        var nextStmts = caller.split('\n').filter(function(stmt) {
            if (isNext || stmt.indexOf(callerName + '(') >= 0)
                return isNext = true;
            return false;
        });

        dialog.addEventListener('close', function() {
            var returnValue = lastDialog.querySelector('#dialog-body').contentWindow.returnValue;
            dialogDocument.body.removeChild(dialog);
            nextStmts[0] = nextStmts[0].replace(new RegExp('(window\.)?' + callerName + '\(.*\)' , 'g'), JSON.stringify(returnValue));
            var decodedStmts = nextStmts.join('\n').replace(/^function\s+\(\s*\)\s*{/, '');
            var unopenedBraces = (decodedStmts.match(/}/g) || []).length - (decodedStmts.match(/{/g) || []).length;
            var openBraces = repeat('{', unopenedBraces);
            eval(openBraces + '\n' + decodedStmts);
        });
        
        // --------------------------------------------------------------
        // Function to repeat string
        function repeat(pattern, count) {
            if (count < 1) return '';
            var result = '';
            while (count > 1) {
                if (count & 1) result += pattern;
                count >>= 1, pattern += pattern;
            }
            return result + pattern;
        }
        
        throw 'Execution stopped until showModalDialog is closed';
    };
})();
