function path(x, y) {
    var svg = 'm ' + x + ' ' + y + ' ';
    return {
        addVerticalLine: function (length) {
            svg += svgVerticalLine(length);
        },
        addHorizontalLine: function (length) {
            svg += svgHorizontalLine(length);
        },
        addSubPath: function (path) {
            svg += path;
        },
        getPath: function () {
            return '<path d="' + svg + '" fill="transparent" stroke="black"/>';
        }
    }
}

function svgHorizontalLine(length) {
    return " h " + length;
}
function svgVerticalLine(length) {
    return " v " + length;
}


function notchGenerator(xfunc, yfunc, length, notches, thickness, direction) {
    var path = "";
    var size = notches;
    var lineDirection = length > 0 ? 1 : -1;
    length *= lineDirection;
    if (length < (size * 5)) {
        return xfunc(lineDirection * length);
    } else {
        var sizeN = Math.floor(length / size);
        var reminder = length % size;
        if (sizeN % 2) {
            //odd
            var x = reminder / 2;
            sizeN--;
            //odd
        } else {
            var x = (reminder + size) / 2;
            sizeN--;
            sizeN--;
            // par
        }
        path += xfunc(lineDirection * (x + size));
        if (direction > 0) {
            for (var i = 0; i < sizeN / 2; i++) {
                path += yfunc(-1 * thickness);
                path += xfunc(size * lineDirection);
                path += yfunc(thickness);
                path += xfunc(size * lineDirection);
            }
        } else {
            for (var i = 0; i < sizeN / 2; i++) {
                path += yfunc(thickness);
                path += xfunc(size * lineDirection);
                path += yfunc(-1 * thickness);
                path += xfunc(size * lineDirection);
            }
        }
        path += xfunc(lineDirection * x);
    }
    return path;
}

function notchesVertical(length, notches, thickness, direction) {
    return notchGenerator(svgVerticalLine, svgHorizontalLine, length, notches, thickness, direction);
}

function notchesHorizontal(length, notches, thickness, direction) {
    return notchGenerator(svgHorizontalLine, svgVerticalLine, length, notches, thickness, direction);

}

var LEFT = 1, RIGHT = -1, UP = 1, DOWN = -1;


function generateRightSide(height, width, depth, notches, thickness, x, y) {
    var J = 50, E = -height + J, F = -35, G = 25, H = -22, A = -1 * (H + F), B = depth, C = height, D = -depth,
        I = -J + (-1) * G;
    var svg = path(x, y);

    svg.addHorizontalLine(A + B);
    svg.addSubPath(notchesVertical(C, notches, thickness, LEFT));
    svg.addSubPath(notchesHorizontal(D, notches, thickness, UP));
    svg.addVerticalLine(E);
    svg.addHorizontalLine(F);
    svg.addVerticalLine(G);
    svg.addHorizontalLine(H);
    svg.addVerticalLine(I);
    return svg.getPath();
}

function generateLeftSide(height, width, depth, notches, thickness, x, y) {
    var J = 50, E = -height + J, F = -35, G = 25, H = -22, A = -1 * (H + F), B = depth, C = height, D = -depth,
        I = -J + (-1) * G;
    var svg = path(x + A + B, y);

    svg.addVerticalLine(-I);
    svg.addHorizontalLine(H);
    svg.addVerticalLine(-G);
    svg.addHorizontalLine(F);
    svg.addVerticalLine(-E);
    svg.addSubPath(notchesHorizontal(D, notches, thickness, UP));
    svg.addSubPath(notchesVertical(-C, notches, thickness, RIGHT));
    svg.addHorizontalLine(A + B);
    return svg.getPath();
}

function generateFront(height, width, depth, thickness, x, y) {
    return '<path d="m ' + x + ' ' + y + ' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBottom(height, width, depth, thickness, x, y) {
    return '<path d="m ' + x + ' ' + y + ' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBack(height, width, depth, thickness, x, y) {
    return '<path d="m ' + x + ' ' + y + ' h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 10 v -5 h 10 v 5 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 10 h 5 v 10 h -5 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -10 v 5 h -10 v -5 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -10 h -5 v -10 h 5 v -5 " fill="transparent" stroke="black"/>'

}

function generateBox(height, width, depth, notches, thickness) {
    var html = '<svg width="250mm" height="' + (2 * height + 40) + 'mm" viewBox="0 0 250 ' + (2 * height + 40) + '">';
    html += generateRightSide(height, width, depth, notches, thickness, 10, 10);
    html += generateLeftSide(height, width, depth, notches, thickness, 10, height + 20);
    //html += generateFront(height, width, depth, thickness, 100, 10);
    //html += generateBottom(height, width, depth, thickness, 10, 100);
    //html += generateBack(height, width, depth, thickness, 100, 100);
    html += '</svg>';
    return html;
}

height = 150;
width = 40;
depth = 150;
thickness = 5;

//document.getElementById("content").innerHTML = generateBox(height, width, depth, thickness);

const express = require('express');
const app = express();

app.get('/', function (req, res) {
    //console.log(req.query.height, req.query.width, req.query.depth, req.query.thickness);

    res.send(
        generateBox(
            parseInt(req.query.height),
            parseInt(req.query.width),
            parseInt(req.query.depth),
            parseInt(req.query.notches),
            parseInt(req.query.thickness)));
});

app.listen(3001, function () {
    console.log('Example app listening on port 3000!')
});