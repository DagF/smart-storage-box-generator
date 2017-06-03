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


function notchGenerator(xfunc, yfunc,length, notches, thickness) {
    var path = "";
    var size = notches;
    var direction = length > 0 ? 1 : -1;
    length *= direction;
    if (length < (size * 5)) {
        return xfunc(direction * length);
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
        path += xfunc(direction * (x + size));
        if (direction) {
            for (var i = 0; i < sizeN / 2; i++) {
                path += yfunc(-1 * thickness);
                path += xfunc(size * direction);
                path += yfunc(thickness);
                path += xfunc(size * direction);
            }
        } else {
            for (var i = 0; i < sizeN / 2; i++) {
                path += yfunc(thickness);
                path += xfunc(size * direction);
                path += yfunc(-1 * thickness);
                path += xfunc(size * direction);
            }
        }
        path += xfunc(direction * x);
    }
    return path;
}

function notchesVertical(length, notches, thickness) {
    return notchGenerator(svgVerticalLine, svgHorizontalLine, length, notches, thickness);
}

function notchesHorizontal(length, notches, thickness) {
    return notchGenerator(svgHorizontalLine, svgVerticalLine, length, notches, thickness);

}

function generateSide(height, width, depth, notches, thickness, x, y) {
    var side = path(x, y);
    var J = 50, E = -height + J, F = -35, G = 25, H = -22, A = -1 * (H + F), B = depth, C = height, D = -depth, I = -J -1*G;
    side.addHorizontalLine(A + B);
    side.addSubPath(notchesVertical(C, notches, thickness));
    side.addSubPath(notchesHorizontal(D, notches, thickness));
    side.addVerticalLine(E);
    side.addHorizontalLine(F);
    side.addVerticalLine(G);
    side.addHorizontalLine(H);
    side.addVerticalLine(I);
    return side.getPath();
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
    var html = '<svg width="250mm" height="250mm" viewBox="0 0 250 250">';
    html += generateSide(height, width, depth, notches, thickness, 10, 10);
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