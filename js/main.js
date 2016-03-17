"use strict";

//function main() {
	
//turn renderHighQuality on for pixel-level processing.    Cool but not realtime.
//var renderHighQuality = false;

//---     MAIN CONTROLS     ---
var firstRun = true;

//if you want to avoid chain reactions, try 0, 20, 100, 0.2
var delayCounter = 0;    // delays start of spread
var lifeCounter = 20;    // how long spread lasts
var respawnCounter = 50; // how long until retrigger
var globalChaos = 0.3;    // 0 = min, 1 = max
//-------------------------
var numFrames = 50;
var renderCounterMax = 1000;
//----
var lowQualityReduceBy = 6; //5;
var sW = 140 * lowQualityReduceBy;
var sH = 42 * lowQualityReduceBy;
var fps = 60; //24;
var currentFrame = 0;
var renderCounter = 0;
var mapImg = new Array(numFrames); // PImage
var scaleImg = new Array(numFrames); // PImage
var numColumns, numRows;
var guyWidth, guyHeight, startX, startY;
var mainGrid = [];
var setRules = "";
var odds_X_Yplus1, odds_Xminus1_Y, odds_X_Yminus1, odds_Xplus1_Y, odds_Xplus1_Yplus1, odds_Xminus1_YminuX1, odds_Xplus1_Yminus1, odds_Xminus1_Yplus1;

function initGlobals() {
    //if (renderHighQuality) {
        //numColumns = sW;
        //numRows = sH;
    //} else {
    numColumns = sW / lowQualityReduceBy;
    numRows = sH / lowQualityReduceBy;
    //}
    guyWidth = sW / numColumns;
    guyHeight = sH / numRows;

    startX = guyWidth / 2;
    startY = guyHeight / 2;

    // make mainGrid a 2D array
    for (var i = 0; i < numColumns; i++) {
        var mg = [];
        for (var j = 0; j < numRows; j++) {
            var g = new GridGuy(startX, startY, guyWidth, guyHeight, setRules, globalChaos, delayCounter, lifeCounter, respawnCounter);
            mg.push(g);
        }
        mainGrid.push(mg);
    }
}

function keyPressed() {
    resetAll();
}

function rulesHandler(x, y) { // int x, int y
    if (mainGrid[x][y].switchArray[0]) {    // NWcorner
    	//
    } else if (mainGrid[x][y].switchArray[1]) {    // NEcorner
    	//
    } else if (mainGrid[x][y].switchArray[2]) {    // SWcorner
    	//
    } else if (mainGrid[x][y].switchArray[3]) {     // SEcorner
    	//
    } else if (mainGrid[x][y].switchArray[4]) {    //Nrow
    	//
    } else if (mainGrid[x][y].switchArray[5]) {    //Srow
    	//
    } else if (mainGrid[x][y].switchArray[6]) {    //Wrow
    	//
    } else if (mainGrid[x][y].switchArray[7]) {    //Erow
    	//
    } else { // everything else
        if (mainGrid[x][y].clicked) {
            //these are direction probabilities
            mainGrid[x][y + 1].kaboom = diceHandler(1, odds_X_Yplus1);
            mainGrid[x - 1][y].kaboom = diceHandler(1, odds_Xminus1_Y);
            mainGrid[x][y - 1].kaboom = diceHandler(1, odds_X_Yminus1);
            mainGrid[x + 1][y].kaboom = diceHandler(1, odds_Xplus1_Y);
            mainGrid[x + 1][y + 1].kaboom = diceHandler(1, odds_Xplus1_Yplus1);
            mainGrid[x - 1][y - 1].kaboom = diceHandler(1, odds_Xminus1_YminuX1);
            mainGrid[x + 1][y - 1].kaboom = diceHandler(1, odds_Xplus1_Yminus1);
            mainGrid[x - 1][y + 1].kaboom = diceHandler(1, odds_Xminus1_Yplus1);
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
    mainGrid[x][y] = new GridGuy(startX, startY, guyWidth, guyHeight, setRules, globalChaos, delayCounter, lifeCounter, respawnCounter);
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
            mainGrid[x][y].hovered = false;
            mainGrid[x][y].clicked = false;
            mainGrid[x][y].kaboom = false;
            mainGrid[x][y].delayCountDown = mainGrid[x][y].delayCountDownOrig;
            mainGrid[x][y].lifeCountDown = mainGrid[x][y].lifeCountDownOrig;
            mainGrid[x][y].respawnCountDown = mainGrid[x][y].respawnCountDownOrig;
            mainGrid[x][y].fillColor = mainGrid[x][y].fillColorOrig;
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
    
    for (var i = 0; i < fillBoxButtons.length; i++) {
        randomValues[i] = 0;
        fillBoxButtons[i] = new FillBoxButton(0, 0, buttonSize, color(200, 100, 0), 18, "0.0");
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
    goButton.run();
    
    if (goButton.clicked) {
        firstRun = false;
    }
    
    for (var i = 0; i < numFillBoxButtons; i++) {
        fillBoxButtons[i].run();
        randomValues[i] = fillBoxButtons[i].internalRandomValue;
        console.log(fillBoxButtons[i].internalRandomValue);
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

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

/*
function preload() {
    for (var i = 0; i < mapImg.length; i++) {
        mapImg[i] = loadImage("./images/cellosback_" + (i + 1) + ".png");
    }
}
*/

function setup() {
    createCanvas(sW, sH);
    fillBoxSetup();
    initGlobals();
    
    //if (renderHighQuality) {
        //size(sW, sH, P2D); // try an alternate renderer
    //} else {
        //size(sW, sH, P2D);
    //}
    
    //noCursor();
    //frameRate(fps);

    for (var y = 0; y < numRows; y++) {
        for (var x = 0; x < numColumns; x++) {
            rulesInit(x, y);
            guysInit(x, y);
        }
    }
    
    /*
    for (var i = 0; i < mapImg.length; i++) {
        //mapImg[i] = loadImage("cellosback_" + (i + 1) + ".png"); // moved to preload()
        scaleImg[i] = createImage(numColumns, numRows, RGB);
    }
    */
    //background(0);
}


function draw() {
    background(0);
    if (firstRun){
        fillBoxDraw();
    } else {
        //image(mapImg[currentFrame], 0, 0, numColumns, numRows);
        //scaleImg[currentFrame] = mapImg[currentFrame].get(0, 0, numColumns, numRows);

        for (var y = 0; y < numRows; y++) {
            for (var x = 0; x < numColumns; x++) {
                var loc = x + (y * numColumns);
                //if (scaleImg[currentFrame].pixels[loc] != color(0)) {
                //if (loc > 10000) {
                    //mainGrid[x][y].mainFire();
                //}
                rulesHandler(x, y);
                mainGrid[x][y].run();
            }
        }

        /*
        if (currentFrame < numFrames - 1) {
            currentFrame++;
        }
        */
        
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
    }
}
//}

//window.onload = main;

	//--    END
