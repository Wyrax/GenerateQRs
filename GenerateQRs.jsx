// GenerateQRs v1.0
// Adobe InDesign CC script that generates multiple QR codes from single text frame which contains a list of links. Links must start with 'http'/'https' prefix.

if (app.documents.length > 0) {

    // POLYFILLS

    // Array.filter() method
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(func, thisArg) {
            'use strict';
            if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
                throw new TypeError();

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;

            var kValue;
            if (thisArg === undefined) {
                while (++i !== len) {
                // checks to see if the key was set
                    if (i in this) {
                        kValue = t[i]; // in case t is changed in callback
                        if (func(t[i], i, t)) {
                            res[c++] = kValue;
                        }
                    }
                }
            }
            else {
                while (++i !== len) {
                // checks to see if the key was set
                    if (i in this){
                        kValue = t[i];
                        if (func.call(thisArg, t[i], i, t)) {
                            res[c++] = kValue;
                        }
                    }
                }
            }

            res.length = c; // shrink down array to proper size
            return res;
        };
    }

    //String.trim() method
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    var activeDoc = app.documents[0];
    var textArray = [];
    var linksArray = [];

    var textAll = activeDoc.textFrames[0].contents; // Get text frame content
    textAll = textAll.replace(/\r+/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s\s+/g, ' ').trim();
    textArray = textAll.split(' ');
    linksArray = textArray.filter(checkLink); // Make array of links

    activeDoc.textFrames[0].remove();

    var docPages = activeDoc.pages;
    var pageNewWidth = UnitValue("210mm").as('pt');
    var pageNewHeight = UnitValue(linksArray.length*40+10+"mm").as('pt'); //+40 it's a step, +10 it's a bottom margin value

    docPages.item(0).resize(
        CoordinateSpaces.INNER_COORDINATES,
        AnchorPoint.TOP_LEFT_ANCHOR,
        ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
        [pageNewWidth,pageNewHeight],
        true
    );

    for (var i = 0; i < linksArray.length; i++) {
        activeDoc.rectangles.add({
            geometricBounds : [(10 + i * 40),10,(40 + i * 40),40],
            strokeColor : "None",
            fillColor : activeDoc.colors.itemByName("Paper")
        });
        activeDoc.rectangles[0].createHyperlinkQRCode(linksArray[i]);

        activeDoc.textFrames.add({
            geometricBounds : [(10 + i * 40),50,(40 + i * 40),200],
            contents: linksArray[i],
        });
    };
} else {
    alert('Open document first.\nVertical A4 document is default for this script.\nDocument must contain one text frame with links to be converted into QR codes.');
}

// !TESTING NEEDED!
// this regex doesn't catch links without HTTP/HTTPS prefix — need actual work cases to test it's full suitability
// regexDetectURL = '/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig';
function checkLink(textString) {
    return (textString.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig));
}
