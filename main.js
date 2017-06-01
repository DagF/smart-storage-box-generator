function path(x, y){
    var svg = 'm '+x+' '+y+' ';
    return {
        addVerticalLine: function (length) {
            svg += " v " + length;
        },
        addHorizontalLine: function (length) {
            svg += " h " + length;
        },
        getPath: function(){
            return '<path d="' + svg + '" fill="transparent" stroke="black"/>';
        }
    }
}

function generateSide(height, width, depth, thickness, x, y) {
    var side = path(x, y);
    side.addHorizontalLine(depth); // B
    side.addVerticalLine(height); // C
    side.addHorizontalLine(-(depth-57)); // D
    side.addVerticalLine(-25); // E
    side.addHorizontalLine(-35); // F
    side.addVerticalLine(25);  // G
    side.addHorizontalLine(-22);  // H
    side.addVerticalLine(-55); // I
    side.addHorizontalLine(45); // J  Table holder
    side.addVerticalLine(-50); // k  Table holder
    side.addHorizontalLine(-45); // L  Table holder
    side.addVerticalLine(-(height-105)); // A
    return side.getPath();
}

function generateFront(height, width, depth, thickness, x, y) {
    return '<path d="m '+x+' '+y+' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBottom (height, width, depth, thickness, x, y) {
    return '<path d="m '+x+' '+y+' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBack(height, width, depth, thickness, x, y) {
    return '<path d="m '+x+' '+y+' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBox(height, width, depth, thickness){
    var html = '<svg width="250mm" height="250mm" viewBox="0 0 250 250">';
    html += generateSide(height, width, depth, thickness, 10, 10);
    //html += generateFront(height, width, depth, thickness, 100, 10);
    //html += generateBottom(height, width, depth, thickness, 10, 100);
    //html += generateBack(height, width, depth, thickness, 100, 100);
    html += '</svg>';
    return html;
}

height = 200;
width = 40;
depth = 200;
thickness = 0.5;

//document.getElementById("content").innerHTML = generateBox(height, width, depth, thickness);

const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send(generateBox(height, width, depth, thickness))
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});