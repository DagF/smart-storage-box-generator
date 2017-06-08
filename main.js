const pug = require('pug');
const express = require('express');
const app = express();
var exec = require('child_process').exec;
var fs = require('fs');
const path = require('path');

var id = 1;

function svgPath(x, y) {
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
            id++;
            return '<path id="path'+id+'" d="' + svg + '" fill="transparent" style="stroke:#000000;fill:none"/>';
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
    var J = 50, E = -height + J, F = -37, G = 25, H = -22, A = -1 * (H + F), B = depth, C = height, D = -depth,
        I = -J + (-1) * G;
    var svg = svgPath(x, y);

    svg.addHorizontalLine(A + B);
    svg.addSubPath(notchesVertical(C, notches, thickness, LEFT));
    svg.addSubPath(notchesHorizontal(D, notches, thickness, UP));
    svg.addSubPath(notchesVertical(E, notches, thickness, RIGHT));
    svg.addHorizontalLine(F);
    svg.addVerticalLine(G);
    svg.addHorizontalLine(H);
    svg.addVerticalLine(I);
    return svg.getPath();
}

function generateLeftSide(height, width, depth, notches, thickness, x, y) {
    var J = 50, E = -height + J, F = -37, G = 25, H = -22, A = -1 * (H + F), B = depth, C = height, D = -depth,
        I = -J + (-1) * G;
    var svg = svgPath(x + A + B, y);

    svg.addVerticalLine(-I);
    svg.addHorizontalLine(H);
    svg.addVerticalLine(-G);
    svg.addHorizontalLine(F);
    svg.addSubPath(notchesVertical(-E, notches, thickness, LEFT));
    svg.addSubPath(notchesHorizontal(D, notches, thickness, UP));
    svg.addSubPath(notchesVertical(-C, notches, thickness, RIGHT));
    svg.addHorizontalLine(A + B);
    return svg.getPath();
}

function generateFront(height, width, depth, notches, thickness, x, y) {

    var svg = svgPath(x, y);
    svg.addHorizontalLine(width);
    svg.addSubPath(notchesVertical(height, notches, thickness, RIGHT));
    svg.addSubPath(notchesHorizontal(-width, notches, thickness, UP));
    svg.addSubPath(notchesVertical(-height, notches, thickness, LEFT));
    return svg.getPath();
}

function generateBottom(height, width, depth, notches, thickness, x, y) {
    var svg = svgPath(x, y);
    svg.addSubPath(notchesHorizontal(width, notches, thickness, UP));
    svg.addSubPath(notchesVertical(depth - 2 * thickness, notches, thickness, RIGHT));
    svg.addSubPath(notchesHorizontal(-width, notches, thickness, DOWN));
    svg.addSubPath(notchesVertical(-depth + 2 * thickness, notches, thickness, LEFT));
    return svg.getPath();
}

function generateBack(height, width, depth, notches, thickness, x, y) {
    var J = 50;
    var svg = svgPath(x, y);
    svg.addSubPath(notchesHorizontal(width, notches, thickness, DOWN));
    svg.addSubPath(notchesVertical(height - J, notches, thickness, RIGHT));
    svg.addHorizontalLine(-width);
    svg.addSubPath(notchesVertical(-height + J, notches, thickness, LEFT));
    return svg.getPath();
}

function generateBox(height, width, depth, notches, thickness) {
    width -= 2 * thickness;
    var html = '<svg ' +
        ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
        ' xmlns:cc="http://creativecommons.org/ns#"' +
        ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
        ' xmlns:svg="http://www.w3.org/2000/svg"' +
        ' xmlns="http://www.w3.org/2000/svg" ' +
        ' version="1.1" ' +
        ' width="' + ((60 + depth) * 2 + width + 60) + 'mm" ' +
        ' height="' + (2 * height + depth + 60) + 'mm" viewBox="0 0 ' + ((60 + depth) * 2 + width + 60) + ' ' + (2 * height + +depth + 60) + '">';
    html += '<defs    id="defs3450" />        <metadata     id="metadata3453">         <rdf:RDF>    <cc:Work    rdf:about="">        <dc:format>image/svg+xml</dc:format>    <dc:type    rdf:resource="http://purl.org/dc/dcmitype/StillImage" />        <dc:title></dc:title>    </cc:Work>    </rdf:RDF>     </metadata>';
    html += '<g id="g1" style="fill:none">';
    html += generateRightSide(height, width, depth, notches, thickness, 10, 10);
    html += generateLeftSide(height, width, depth, notches, thickness, 60 + depth + width + 30, 10);
    html += generateFront(height, width, depth, notches, thickness, 60 + depth + 20, 10);
    html += generateBottom(height, width, depth, notches, thickness, 60 + depth + 20, height + 20);
    html += generateBack(height, width, depth, notches, thickness, 60 + depth + 20, depth + height + 30);
    html += '</g></svg>';
    return html;
}

height = 150;
width = 40;
depth = 150;
thickness = 5;

//document.getElementById("content").innerHTML = generateBox(height, width, depth, thickness);


app.get('/box.svg', function (req, res) {
    //console.log(req.query.height, req.query.width, req.query.depth,req.query.notches, req.query.thickness);

    res.type('svg');
    res.send(
        generateBox(
            parseInt(req.query.height),
            parseInt(req.query.width),
            parseInt(req.query.depth),
            parseInt(req.query.notches),
            parseInt(req.query.thickness)));


});

app.get('/', function (req, res) {
    var q = req.query;
    q.height = q.height ? q.height : 200;
    q.width = q.width ? q.width : 400;
    q.depth = q.depth ? q.depth : 200;
    q.notches = q.notches ? q.notches : 20;
    q.thickness = q.thickness ? q.thickness : 5;
    var box = generateBox(
        parseInt(q.height),
        parseInt(q.width),
        parseInt(q.depth),
        parseInt(q.notches),
        parseInt(q.thickness));
    var filename = 'H' + q.height + '_w' + q.width + '_d' + q.depth + '_n' + q.notches + '_t' + q.thickness;
    if ('download_svg' in req.query) {
        res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.svg');
        res.type('svg');
        res.send(box);
    }
    else if ('download_dfx' in req.query) {

        if (!fs.existsSync("./files")) {
            fs.mkdirSync("./files");
        }
        if (!fs.existsSync("./files/" + filename + ".svg")) {
            fs.writeFile("./files/" + filename + ".svg", box, function (err) {
                if (err) {
                    return console.log(err);
                }
                var cmd = 'inkscape -f ./files/' + filename + '.svg -E ./files/' + filename + '.esp';
                exec(cmd, function (error, stdout, stderr) {
                    // command output is in stdout
                    console.log("Converting svg to esp");
                    console.log(stdout);
                    console.log(stderr);
                    var cmd = "pstoedit -dt -f 'dxf:-polyaslines -mm' ./files/" + filename + ".esp ./files/" + filename + ".dxf &> /dev/null";

                    exec(cmd, function (error, stdout, stderr) {
                        // command output is in stdout
                        console.log("Converting esp to dxf");
                        console.log(stdout);
                        console.log(stderr);
                        var cmd = 'rm ./files/' + filename + ".esp";

                        exec(cmd, function (error, stdout, stderr) {
                            // command output is in stdout
                            console.log("Removing esp file");
                            console.log(stdout);
                            console.log(stderr);
                            res.download('./files/' + filename + '.dxf', filename + '.dxf');
                        });
                    });
                });
            });
        } else {
            res.download('./files/' + filename + '.dxf', filename + '.dxf');
        }


    } else {
        var fn = pug.compileFile('index.pug', {});
        var html = fn({q: req.query});
        res.send(html);
    }
});

app.listen(3001, function () {
    console.log('Example app listening on port 3000!')
});