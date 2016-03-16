"use strict";

//function main() {
	
//turn renderHighQuality on for pixel-level processing.    Cool but not realtime.
//var renderHighQuality = false;

//---     MAIN CONTROLS     ---
var firstRun = true;
//if you want to avoid chain reactions, try 0, 20, 100, 0.2
var delayCounter = 0;    // delays start of spread
var lifeCounter = 20;    // how long spread lasts
var respawnCounter = 100; // how long until retrigger
var globalChaos = 0.3;    // 0 = min, 1 = max
//-------------------------
var numFrames = 50;
var renderCounterMax = 1000;
//----
var sW = 960;
var sH = 540;
var fps = 24;
var lowQualityReduceBy = 5;
var currentFrame = 0;
var renderCounter = 0;
var mapImg = new Array(numFrames); // PImage
var scaleImg = new Array(numFrames); // PImage
var numColumns, numRows;
var guyWidth, guyHeight, startX, startY;
var bob = [];
var setRules = "";
var odds_X_Yplus1, odds_Xminus1_Y, odds_X_Yminus1, odds_Xplus1_Y, odds_Xplus1_Yplus1, odds_Xminus1_YminuX1, odds_Xplus1_Yminus1, odds_Xminus1_Yplus1;

function preload() {
    for (var i = 0; i < mapImg.length; i++) {
        mapImg[i] = loadImage("./images/cellosback_" + (i + 1) + ".png");
    }
}

function setup() {
    fillBoxSetup();
    initGlobals();
    
    //if (renderHighQuality) {
        //size(sW, sH, P2D); // try an alternate renderer
    //} else {
        //size(sW, sH, P2D);
    //}
    
    createCanvas(sW, sH);
    //noCursor();
    //frameRate(fps);

    for (var y = 0; y < numRows; y++) {
        for (var x = 0; x < numColumns; x++) {
            rulesInit(x, y);
            guysInit(x, y);
        }
    }
    for (var i = 0; i < mapImg.length; i++) {
        //mapImg[i] = loadImage("cellosback_" + (i + 1) + ".png"); // moved to preload()
        scaleImg[i] = createImage(numColumns, numRows, RGB);
    }
    background(0);

    firstRun = false;
}


function draw() {
    //if (firstRun){
        //fillBoxDraw();
    //} else {
	    //image(mapImg[currentFrame], 0, 0, numColumns, numRows);
	    scaleImg[currentFrame] = mapImg[currentFrame].get(0, 0, numColumns, numRows);

	    for (var y = 0; y < numRows; y++) {
	        for (var x = 0; x < numColumns; x++) {
	            var loc = x + (y * numColumns);
	            if (scaleImg[currentFrame].pixels[loc] != color(0)) {
	                bob[x][y].mainFire();
	            }
	            rulesHandler(x, y);
	            bob[x][y].run();
	        }
	    }

	    if (currentFrame < numFrames - 1) {
	    	currentFrame++;
	    }
	    
        /*
        if (renderHighQuality) {
		    if (renderCounter < renderCounterMax) {
		        saveFrame("render/render####.png");
		        console.log("rendered frame: " + (renderCounter+1) + " / " + renderCounterMax);
		        renderCounter++;
		    }else{
		    	exit();
		    }
	    }
        */
    //}
}

function initGlobals() {
    //if (renderHighQuality) {
        //numColumns = sW;
        //numRows = sH;
    //} else {
    numColumns = sW / lowQualityReduceBy;
    numRows = sH / lowQualityReduceBy;
    //}
    guyWidth = width / numColumns;
    guyHeight = height / numRows;
    bob = new Array(numColumns);
    for (var i = 0; i < bob.length; i++) {
        bob[i] = new Array(numRows);
    }
    startX = guyWidth / 2;
    startY = guyHeight / 2;
}


function keyPressed() {
    resetAll();
}

function rulesHandler(x, y) { // int x, int y
    if (bob[x][y].switchArray[0]) {    // NWcorner
    	//
    } else if (bob[x][y].switchArray[1]) {    // NEcorner
    	//
    } else if (bob[x][y].switchArray[2]) {    // SWcorner
    	//
    } else if (bob[x][y].switchArray[3]) {     // SEcorner
    	//
    } else if (bob[x][y].switchArray[4]) {    //Nrow
    	//
    } else if (bob[x][y].switchArray[5]) {    //Srow
    	//
    } else if (bob[x][y].switchArray[6]) {    //Wrow
    	//
    } else if (bob[x][y].switchArray[7]) {    //Erow
    	//
    } else { // everything else
        if (bob[x][y].clicked) {
            //these are direction probabilities
            bob[x][y + 1].kaboom = diceHandler(1, odds_X_Yplus1);
            bob[x - 1][y].kaboom = diceHandler(1, odds_Xminus1_Y);
            bob[x][y - 1].kaboom = diceHandler(1, odds_X_Yminus1);
            bob[x + 1][y].kaboom = diceHandler(1, odds_Xplus1_Y);
            bob[x + 1][y + 1].kaboom = diceHandler(1, odds_Xplus1_Yplus1);
            bob[x - 1][y - 1].kaboom = diceHandler(1, odds_Xminus1_YminuX1);
            bob[x + 1][y - 1].kaboom = diceHandler(1, odds_Xplus1_Yminus1);
            bob[x - 1][y + 1].kaboom = diceHandler(1, odds_Xminus1_Yplus1);
        }
    }
}

function diceHandler(v1, v2) { // float v1, float v2
    var rollDice = random(v1);
    if (rollDice < v2) {
        return true;
    } else {
        return false;
    }
}

function rulesInit(x, y) { // int x, int y
    setRules = "";
    if (x == 0 && y == 0) {
        setRules = "NWcorner";
    } else if (x == numColumns - 1 && y == 0) {
        setRules = "NEcorner";
    } else if (x == 0 && y == numRows - 1) {
        setRules = "SWcorner";
    } else if (x == numColumns - 1 && y == numRows - 1) {
        setRules = "SEcorner";
    } else if (y == 0) {
        setRules = "Nrow";
    } else if (y == numRows - 1) {
        setRules = "Srow";
    } else if (x == 0) {
        setRules = "Wrow";
    } else if (x == numColumns - 1) {
        setRules = "Erow";
    }
}

function guysInit(x, y) { // int x, int y
    bob[x][y] = new GridGuy(startX, startY, guyWidth, guyHeight, setRules, globalChaos, delayCounter, lifeCounter, respawnCounter);
    if (startX < width - guyWidth) {
        startX += guyWidth;
    } else {
        startX = guyWidth / 2;
        startY += guyHeight;
    }
    console.log("init " + x + " " + y);
}

function resetAll() {
    startX = 0;
    startY = 0;
    currentFrame = 0;
    for (var y = 0; y < numRows; y++) {
        for (var x = 0; x < numColumns; x++) {
            bob[x][y].hovered = false;
            bob[x][y].clicked = false;
            bob[x][y].kaboom = false;
            bob[x][y].delayCountDown = bob[x][y].delayCountDownOrig;
            bob[x][y].lifeCountDown = bob[x][y].lifeCountDownOrig;
            bob[x][y].respawnCountDown = bob[x][y].respawnCountDownOrig;
            bob[x][y].fillColor = bob[x][y].fillColorOrig;
        }
    }
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

var buttonSize = 80;
var centerPointX = sW / 2;
var centerPointY = sH / 2;
var doubleClickedGlobal = false;

var numFillBoxButtons = 8;
var fillBoxButtons = new Array(numFillBoxButtons);
var goButton; // Button
var randomValues = new Array(numFillBoxButtons);

function fillBoxSetup() {
    goButton = new Button(sW/2, sH/2, buttonSize * 0.75, color(0, 200, 0), 16, "GO");
    
    for (var i = 0; i < numFillBoxButtons; i++) {
        fillBoxButtons[i] = new FillBoxButton(0, 0, buttonSize, color(200, 100, 0), 18, "" + randomValues[i]);
        randomValues[i] = 0;
    }

    fillBoxButtons[0].posX = (sW / 2) - buttonSize;
    fillBoxButtons[0].posY = (sH / 2) - buttonSize;
    fillBoxButtons[1].posX = (sW / 2);
    fillBoxButtons[1].posY = (sH / 2) - buttonSize;
    fillBoxButtons[2].posX = (sW / 2) + buttonSize;
    fillBoxButtons[2].posY = (sH / 2) - buttonSize;
    fillBoxButtons[3].posX = (sW / 2) - buttonSize;
    fillBoxButtons[3].posY = (sH / 2);
    fillBoxButtons[4].posX = (sW / 2) + buttonSize;
    fillBoxButtons[4].posY = (sH / 2);
    fillBoxButtons[5].posX = (sW / 2) - buttonSize;
    fillBoxButtons[5].posY = (sH / 2) + buttonSize;
    fillBoxButtons[6].posX = (sW / 2);
    fillBoxButtons[6].posY = (sH / 2) + buttonSize;
    fillBoxButtons[7].posX = (sW / 2) + buttonSize;
    fillBoxButtons[7].posY = (sH / 2) + buttonSize;
}

function fillBoxDraw() {
    goButton.update();
    
    if (goButton.clicked) {
        firstRun = false;
    }
    
    for (var i = 0; i < numFillBoxButtons; i++) {
        fillBoxButtons[i].update();
        randomValues[i] = fillBoxButtons[i].internalRandomValue;
    }

    odds_Xminus1_YminuX1 = randomValues[0]; // x-1 y-1
    odds_X_Yminus1 = randomValues[1]; // x y-1
    odds_Xplus1_Yminus1 = randomValues[2]; // x+1 y-1
    odds_Xminus1_Y = randomValues[3]; // x-1 y
    odds_Xplus1_Y = randomValues[4]; // x+1 y
    odds_Xminus1_Yplus1 = randomValues[5]; // x-1 y+1
    odds_X_Yplus1 = randomValues[6]; // x y+1
    odds_Xplus1_Yplus1 = randomValues[7]; // x+1 y+1
}

/*
function mousePressed() {
  // mouseEvent variable contains the current event information
    if (mouseEvent.getClickCount()==2) {
      doubleClickedGlobal=true; 
    }
}
*/

//}

//window.onload = main;

	//--    END
