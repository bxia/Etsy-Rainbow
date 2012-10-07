var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var GRID_WIDTH = 100;
var GRID_HEIGHT = 100;

var ROWS = CANVAS_HEIGHT/GRID_HEIGHT;
var COLS = CANVAS_WIDTH/GRID_WIDTH;

var GRID_ALPHA = 0.05;
var DRAW_TIMES = 1/GRID_ALPHA;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


/* Grid object */

function Grid (xCord, yCord) {
    this.x = xCord;
    this.y = yCord;
//    this.color = color;
    this.color = "rgba(250,90,90," + GRID_ALPHA + ")";
}

Grid.prototype.draw = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, GRID_WIDTH, GRID_HEIGHT);
}

function fadeIn(){
	var count =0;
	var id = setInterval(function(){
		if(count === DRAW_TIMES){
			clearInterval(id);
		}
		else{
			for( var row = 0; row < ROWS; row++){
				for(var col = 0; col < COLS; col++){
					colorGrid[row][col].color = "rgba(250,90,90," + GRID_ALPHA*(count+1) + ")";
					colorGrid[row][col].draw();
				}
			}
			count++;
		}
	},70);
}

function drawAll(){
	for( var row = 0; row < ROWS; row++){
		for(var col = 0; col < COLS; col++){
			colorGrid[row][col].color = "rgba(250,90,90,1)";
			colorGrid[row][col].draw();
		}
	}
}


/* Set up color grid */
function transition() {

    var colorGrid = new Array(ROWS);
    for (var i=0; i<colorGrid.length;i++){
        colorGrid[i] = new Array(COLS);
    }

    for( var row = 0; row < ROWS; row++){
        for(var col = 0; col < COLS; col++){
            var newGrid = new Grid(col*GRID_HEIGHT, row*GRID_WIDTH);
            colorGrid[row][col] = newGrid;
        }
    }

    fadeIn();
}
