var ROW = 6;
var COL = 8;

// the frame in hsl at the begining
var startFrame = [
        [359,  100, 90],
        [20, 100, 90],
        [359,  100, 10],
        [20, 100, 10]];

var frame = [[],[],[],[]];
     

var zoomLevel = 0;
var map = $("#grid_map");
var grids = map.find(".grid");

var lastCenter = undefined;
var debug = false;

/*
 * Get the hsl code depending on the grid we are on and our current zoom level.
 */
function getHsl(id, currentFrame) {
    var gridRow = Math.floor(id / 10 % 10);
    var gridCol = Math.floor(id % 10);
    var xDelta = (frame[0][0] - frame[1][0])/(COL-1);
    var yDelta = (frame[0][2] - frame[2][2])/(ROW-1);

    var h, s, l;
    h = currentFrame[0][0] - (gridCol * xDelta);
    s = 100;
    l = currentFrame[0][2] - (gridRow * yDelta);
    return [h, s, l]; 
}

/*
 * Stolen from https://gist.github.com/1337890
 * I have no idea how this works. 
 * But it converts hsl to hsv color code
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
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

function debugLog(msg) {
    if (debug === true) {
        console.log(msg);
    }
}

function drawMap() {
    var l = ($('.popup-marker'));
    for(var i=0;i<l.length;i++){
        ($(l[i]).popover('hide'));  
    }
    prevID = undefined;
    $.each(grids, function(index, value) {
        // get hsl value of this grid
        var gridId = value.id;
        var hsl = getHsl(gridId, frame);
        var hslStr = Math.floor(hsl[0]) + "," + 
                     Math.floor(hsl[1]) + "," +
                     Math.floor(hsl[2]);
        // $(this).html(hslStr);
        
        var element = $(this);
        $(this).html("<div class='image'></div>");
        // scale hsl, convert to hsv and scale back
        var hsv = hsl2hsv(hsl[0], hsl[1]/100, hsl[2]/100);
        hsv = [hsv[0], hsv[1]*100, hsv[2]*100];
        hsv[0] = Math.floor(hsv[0]);
        hsv[1] = Math.floor(hsv[1]);
        hsv[2] = Math.floor(hsv[2]);

        var rgb = hslToRgb(hsl[0]/360, hsl[1]/100, hsl[2]/100);
        var rgbStr = "rgb(" + 
                     Math.floor(rgb[0]) + ", " + 
                     Math.floor(rgb[1]) + ", " + 
                     Math.floor(rgb[2]) + ")"
        $(this).css("background-color", rgbStr);
        $(this).addClass("gridBefore");

    });
}


function zoom(dir, center) {
    var xDelta = (startFrame[0][0] - startFrame[1][0])/(COL-1);
    var yDelta = (startFrame[0][2] - startFrame[2][2])/(ROW-1);
    var xZoomDeltaLeft = xDelta / 2;
    var xZoomDeltaRight = xZoomDeltaLeft;
    var yZoomDeltaUp = yDelta / 2;
    var yZoomDeltaDown = yZoomDeltaUp;

    if (arguments.length === 2) {
        var hsv = getHsl(center, frame);
        // case 1: left side not enough room
        var xLeftDiff = frame[0][0] - hsv[0];
        if (xLeftDiff < xZoomDeltaLeft) {
            xZoomDeltaLeft = xLeftDiff;
            xZoomDeltaRight += xZoomDeltaLeft - xLeftDiff;
        }
        // case 2: right side not enough room
        var xRightDiff = hsv[0] - frame[1][0];
        if (xRightDiff < xZoomDeltaRight) {
            xZoomDeltaRight = xRightDiff;
            xZoomDeltaLeft += xZoomDeltaRight - xRightDiff;
        }
        // case 3: upper side
        var yUpDiff = frame[0][2] - hsv[2];
        if (frame[0][2] - hsv[2] < yZoomDeltaUp) {
            yZoomDeltaUp = yUpDiff;
            yZoomDeltaDown += yZoomDeltaUp - yUpDiff;
        }
        // case 4: lower side
        var yDownDiff = hsv[2] - frame[2][2];
        if (hsv[2] - frame[2][2] < yZoomDeltaDown) {
            yZoomDeltaDown = yDownDiff;
            yZoomDeltaUp += yZoomDeltaDown - yDownDiff;
        }
    }

    if (dir === "out") { // out is the reverse of in
        if (zoomLevel === 0) {
            debugLog("level = " + zoomLevel + ", cannot zoom out");
            return;
        }
        debugLog("zooming out from: " + lastCenter);
        debugLog("zoomLevel after zoom out: " + zoomLevel);
        xZoomDeltaLeft *= -1;
        xZoomDeltaRight *= -1;
        yZoomDeltaUp *= -1;
        yZoomDeltaDown *= -1;
        zoomLevel -= 1;
        lastCenter = undefined;
    } else if (dir === "in") {
        if (zoomLevel === 5) {
            debugLog("level = " + zoomLevel + ", cannot zoom in");
            return;
        }
        zoomLevel += 1;
        lastCenter = center;
        debugLog("zooming in to: " + lastCenter);
        debugLog("zoomLevel after zoom in: " + zoomLevel);
    }
    // change upper left
    frame[0][0] = frame[0][0] - xZoomDeltaLeft;
    frame[0][2] = frame[0][2] - yZoomDeltaUp;
    // change upper right
    frame[1][0] = frame[1][0] + xZoomDeltaRight;
    frame[1][2] = frame[1][2] - yZoomDeltaUp;
    // change lower left
    frame[2][0] = frame[2][0] - xZoomDeltaLeft;
    frame[2][2] = frame[2][2] + yZoomDeltaDown;
    // change lower right
    frame[3][0] = frame[3][0] + xZoomDeltaRight;
    frame[3][2] = frame[3][2] + yZoomDeltaDown;

    // $("#products").append("<canvas id="myCanvas" width="800" height="600"></canvas>");
    
     
    drawMap();
}

function reset() {
    frame[0] = $.extend(true, [], startFrame[0]);
    frame[1] = $.extend(true, [], startFrame[1]);
    frame[2] = $.extend(true, [], startFrame[2]);
    debugLog("redrawing map from start");
    drawMap();
}

function move(dir) {
    if (zoomLevel <= 1) {
        debugLog("at top 2 level, cannot move");
        return;
    }

    var xDelta = (startFrame[0][0] - startFrame[1][0])/(COL-1);
    var yDelta = (startFrame[0][2] - startFrame[2][2])/(ROW-1);
    if (dir === "up") {
        if (frame[0][2] >= startFrame[0][2]) {
            debugLog("reached top, cannot move up");
            return;
        }
        for (var i=0; i<frame.length; i++) {
            debugLog("moving up by: " + yDelta);
            frame[i][2] += yDelta;
        }
    } else if (dir === "down") {
        if (frame[2][2] <= startFrame[2][2]) {
            debugLog("reached bottom, cannot move down");
            return;
        }
        for (var i=0; i<frame.length; i++) {
            frame[i][2] -= yDelta;
        }
    } else if (dir === "left") {
        if (frame[0][0] >= startFrame[0][0]) {
            debugLog("reached start, cannot move left");
            return;
        }
        for (var i=0; i<frame.length; i++) {
            frame[i][0] += xDelta;
        }
    } else {
        if (frame[1][0] <= startFrame[1][0]) {
            debugLog("reached end, cannot move right");
            return;
        }
        for (var i=0; i<frame.length; i++) {
            frame[i][0] -= xDelta;
        }
    }

    drawMap();
}

function start() {

    reset();

    var inButton = document.getElementById("zoom-in");
    inButton.onclick = function() {

        zoom("in");
    }
    var outButton = document.getElementById("zoom-out");
    outButton.onclick = function() {
        if (lastCenter !== undefined) {
            zoom("out", lastCenter);
        } else {
            zoom("out");
        }
    }
    var resetButton = document.getElementById("pan-center");
    resetButton.onclick = function() {
        reset();
    }

    // $(document).ready(function() {
    //     $(window).scroll(function() {
    //         alert($(window).scrollTop());
    //     });
    // });

    // $(document).ready(function() {
    //     $(".grid").smoothDivScroll(function(event) {
    //         alert("BBBBBB");
    //         debugLog($(this).attr("id"));
    //         zoom("in", $(this).attr("id"));
    //         event.preventDefault();
    //     });
    // });

    var upButton = document.getElementById("pan-up");
    upButton.onclick = function() {
        move("up");
    }

    var downButton = document.getElementById("pan-down");
    downButton.onclick = function() {
        move("down");
    }

    var leftButton = document.getElementById("pan-left");
    leftButton.onclick = function() {
        move("left");
    }

    var rightButton = document.getElementById("pan-right");
    rightButton.onclick = function() {
        move("right");
    }
}

start();
