var activeDoc = app.documents[0];

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
var arrayLength = 40;

var pageNewWidth = UnitValue("210mm").as('pt');
var pageNewHeight = UnitValue(arrayLength*40+10+"mm").as('pt'); //+40 it's a step, +10 it's a bottom margin value



docPages.item(0).resize(
    CoordinateSpaces.INNER_COORDINATES,
    AnchorPoint.TOP_LEFT_ANCHOR,
    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
    [pageNewWidth,pageNewHeight],
    true
);


for (var i = 0; i < arrayLength; i++) {
    //var y1 = 10 + i * 40;
    activeDoc.rectangles.add({
        geometricBounds : [(10 + i * 40),10,(40 + i * 40),40],
        strokeColor : "None",
        fillColor : activeDoc.colors.itemByName("C=0 M=0 Y=100 K=0")
        //fillColor : activeDoc.colors.itemByName("Paper")
    });

    activeDoc.textFrames.add({
        geometricBounds : [(10 + i * 40),50,(40 + i * 40),200],
        contents: "i = "+i,
    });
};