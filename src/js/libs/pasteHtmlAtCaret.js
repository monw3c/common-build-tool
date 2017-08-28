/**
 * 处理插入多表情问题
 * @param {[type]} contentEditableElement [description]
 * var els = document.getElementById("eidts");
            pasteHtmlAtCaret(imgs, els);
 */
        function setEndOfContenteditable(contentEditableElement) {
            var range, selection;
            if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
            {
                range = document.createRange(); //Create a range (a range is a like the selection but invisible)
                range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
                range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
                selection = window.getSelection(); //get the selection object (allows you to change selection)
                selection.removeAllRanges(); //remove any selections already made
                selection.addRange(range); //make the range you have just created the visible selection
            } else if (document.selection) //IE 8 and lower
            {
                range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
                range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
                range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
                range.select(); //Select the range (make it the visible selection
            }
        }

        function elementContainsSelection(el) {
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount > 0) {
                    for (var i = 0; i < sel.rangeCount; ++i) {
                        if (!isOrContains(sel.getRangeAt(i).commonAncestorContainer, el)) {
                            return false;
                        }
                    }
                    return true;
                }
            } else if ((sel = document.selection) && sel.type != "Control") {
                return isOrContains(sel.createRange().parentElement(), el);
            }
            return false;
        }

        function isOrContains(node, container) {
            while (node) {
                if (node === container) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        function pasteHtmlAtCaret(html, el) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (elementContainsSelection(el)) {
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        // Range.createContextualFragment() would be useful here but is
                        // non-standard and not supported in all browsers (IE9, for one)
                        var el = document.createElement("div");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(),
                            node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    } else if (document.selection && document.selection.type != "Control") {
                        // IE < 9
                        document.selection.createRange().pasteHTML(html);
                    }
                } else {
                    setEndOfContenteditable(el);
                    pasteHtmlAtCaret(html, el);
                }
            }

        }