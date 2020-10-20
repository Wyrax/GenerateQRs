// Script INFO

if (app.documents.length > 0) {

    // POLYFILLS

    // Array.filter() method
    if (!Array.prototype.filter){
        Array.prototype.filter = function(func, thisArg) {
          'use strict';
          if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
              throw new TypeError();
         
          var len = this.length >>> 0,
              res = new Array(len), // preallocate array
              t = this, c = 0, i = -1;
      
          var kValue;
          if (thisArg === undefined){
            while (++i !== len){
              // checks to see if the key was set
              if (i in this){
                kValue = t[i]; // in case t is changed in callback
                if (func(t[i], i, t)){
                  res[c++] = kValue;
                }
              }
            }
          }
          else{
            while (++i !== len){
              // checks to see if the key was set
              if (i in this){
                kValue = t[i];
                if (func.call(thisArg, t[i], i, t)){
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
    //var testArray = ["av","ds","12wer"];

    //get data then remove text frame
    
    
    
    var textAll = activeDoc.textFrames[0].contents;
    $.writeln('textAll before = '+textAll);
    textAll = textAll.replace(/\r+/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s\s+/g, ' ').trim();
    $.writeln('textAll after = '+textAll);

    textArray = textAll.split(' ');

    linksArray = textArray.filter(checkLink);

    $.writeln('linksArray = '+linksArray);
    //$.writeln('testArray = '+testArray);


    activeDoc.textFrames[0].remove();
    //var rect =

    /*activeDoc.rectangles.add({
        geometricBounds : [10,30,50,150], // y1,x1,y2,x2
        //fillColor : myDoc.colors.itemByName("Yellow")
        fillColor : activeDoc.colors.itemByName("C=0 M=0 Y=100 K=0")
        });*/

    //app.selection[0].createHyperlinkQRCode ("https://www.indesignjs.de/extendscriptAPI/indesign14/#EPS.html#d1e240502__d1e242534");


    /*
        get value of text block
        make array of URLs
            - trim/replace \r \s etc.
            - filter proper links
            - generate report
        make {URLarray.length} blocks + text blocks near them
            - geometricBounds: step by index values
            - 
        insert QR into blocks
            - insert QR
            - insert link value near
        
    */

    var docPages = activeDoc.pages;
    //var W = UnitValue("240mm").as('pt');
    //var L = UnitValue("100mm").as('pt');
    var arrayLength = 10;

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
        //var y1 = 10 + i * 40;
        activeDoc.rectangles.add({
            geometricBounds : [(10 + i * 40),10,(40 + i * 40),40],
            strokeColor : "None",
            fillColor : activeDoc.colors.itemByName("C=0 M=0 Y=100 K=0")
            //fillColor : activeDoc.colors.itemByName("Paper")
        });
        activeDoc.rectangles[0].createHyperlinkQRCode(linksArray[i]);

        activeDoc.textFrames.add({
            geometricBounds : [(10 + i * 40),50,(40 + i * 40),200],
            contents: "i = "+linksArray[i],
        });
    };



} else {
    alert('Open document first.\nVertical A4 document is default for this script.\nDocument must contain one text frame with links to be converted into QR codes.');
}

// !TESTING NEEDED!
// this regex doesn't catch links without HTTP/HTTPS prefix — need actual work cases to test it's full suitability
// regexDetectURL = '/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig';
function checkLink(textString) {
    $.writeln(textString.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig));
    return (textString.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig));
}
