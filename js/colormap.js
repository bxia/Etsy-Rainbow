var ROW = 6;
var COL = 8;

var startFrame = [
        [359,  100, 90],
        [20, 100, 90],
        [359,  100, 10],
        [20, 100, 10]];

var map = $("#grid_map");
var grids = map.find(".grid");

/*
 * Get the hsl code depending on the grid we are on and our current frame
 */
function getHSV(id, currentFrame) {
    var gridRow = Math.floor(id / 10 % 10);
    var gridCol = Math.floor(id % 10);
    var vertDelta = (currentFrame[0][2] - currentFrame[2][2])/(ROW-1);
    var horiDelta = (currentFrame[1][0] - currentFrame[0][0])/(COL-1);

    var h, s, l;
    h = currentFrame[0][0] + (gridCol * horiDelta);
    s = 100;
    l = currentFrame[0][2] - (gridRow * vertDelta);
    hsv = hsl2hsv(h, s/100, l/100);
    hsv = [hsv[0], hsv[1]*100, hsv[2]*100];
    var str = id + "|hsl:" + [h,s,l] + "\t\thsv:" + hsv
    // console.log(str);
    return hsv;
}

/*
 * stolen from https://gist.github.com/1337890
 * I have no idea how this works. But is convert hsl to hsv color code
 */
function hsl2hsv(hue, sat, light) {
    sat*=light<0.5 ? light : 1-light;
    return[ //[hue, saturation, value]
        //Range should be between 0 - 1
        hue, //Hue stays the same
        2*sat/(light+sat), //Saturation
        light+sat //Value
    ];
}
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

function drawMap(dir) {
    if (dir === "in") zoomIn()
    $.each(grids, function(index, value) {
        var gridId = value.id;
        var hsv = getHSV(gridId, startFrame);
        hsv[0] = Math.floor(hsv[0]);
        hsv[1] = Math.floor(hsv[1]);
        hsv[2] = Math.floor(hsv[2]);
        $(this).html(hsv.toString());
        var rgb = hsvToRgb(hsv[0]/360, hsv[1]/100, hsv[2]/100);
        var rgbStr = "rgb(" + Math.floor(rgb[0]) + ", " + Math.floor(rgb[1]) + ", " + Math.floor(rgb[2]) + ")"
        console.log(rgbStr);
        $(this).css("background-color", rgbStr);
        console.log(hsv);
    });
}

function zoomIn() {
    var vertDelta = (startFrame[0][2] - startFrame[2][2])/(ROW-1) /4;
    var horiDelta = (startFrame[1][0] - startFrame[0][0])/(COL-1) /4;
    // change upper left
    startFrame[0][0] = startFrame[0][0] + horiDelta;
    startFrame[0][2] = startFrame[0][2] - vertDelta;
    // change upper right
    startFrame[1][0] = startFrame[1][0] - horiDelta;
    startFrame[1][2] = startFrame[1][2] - vertDelta;
    // change lower left
    startFrame[2][0] = startFrame[2][0] + horiDelta;
    startFrame[2][2] = startFrame[2][2] + vertDelta;
    // change lower right
    startFrame[3][0] = startFrame[3][0] - horiDelta;
    startFrame[3][2] = startFrame[3][2] + vertDelta;
}

drawMap("nil");

var button = document.getElementById("myButton");
button.onclick = function() {
    drawMap("in");
}
