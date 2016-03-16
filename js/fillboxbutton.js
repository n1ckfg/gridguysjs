"use strict";

function FillBoxButton(x, y, s, oc, fs, d) { // float x, float y, float s, color oc, int fs, String d
    this.internalRandomValue = 0;
    this.hovered = false;
    this.clicked = false;
    this.maxmin = false;

    this.gaugeMaxColor = color(0,255,0);
    this.gaugeMinColor = color(255,0,0);
    this.gaugeFreeColor = color(0,0,255);
    this.gaugeNowColor = this.gaugeFreeColor;

    this.posX = x;
    this.posY = y;
    this.sizeXY = s;
    this.offColor = oc;
    this.hoverColor = this.highlight(oc, color(100,0,0));
    this.clickColor = this.highlight(oc, color(200,0,0));
    this.nowColor = oc;
    this.fontSize=fs;
    this.font = "Arial";
    this.label = d;
}

FillBoxButton.prototype.update = function() {
    if (this.hitDetect(mouseX, mouseY, 0, 0, this.posX, this.posY, this.sizeXY, this.sizeXY)) {
        if (!mouseIsPressed) {
            this.hovered = true;
            this.clicked = false;
        } else if (mouseIsPressed) {
            this.hovered = true;
            this.clicked = true;
        }
    } else {
        this.hovered = false;
        this.clicked = false;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (this.clicked && !this.maxmin) {
        this.internalRandomValue = abs(mouseY - (this.posY + (this.sizeXY / 2))) / this.sizeXY;
        this.label = "" + this.roundToPlaces(this.internalRandomValue, 2);
    }

    if (this.hovered && this.doubleClickedGlobal) {
        this.doubleClickedGlobal = false;
        if (!this.maxmin) {
            this.gaugeNowColor = this.gaugeMaxColor;
            this.internalRandomValue = 1;
            this.maxmin = true;
        } else if (this.maxmin && this.internalRandomValue == 1) {
            this.gaugeNowColor = this.gaugeMinColor;
            this.internalRandomValue = 0;
        } else if (this.maxmin && this.internalRandomValue == 0) {
            this.gaugeNowColor = this.gaugeFreeColor;
            this.maxmin = false;
        }

        this.label = "" + this.roundToPlaces(this.internalRandomValue, 2);
    }
}

FillBoxButton.prototype.draw = function() {
    rectMode(CENTER);
    noStroke();

    if (!this.maxmin) {
        if (this.hovered && !this.clicked) {
            this.nowColor = this.hoverColor;
        } else if (this.hovered && this.clicked) {
            this.nowColor = this.clickColor;
        } else if (!this.hovered && !this.clicked) {
            this.nowColor = this.offColor;
        }
    } else {
        this.nowColor = this.gaugeNowColor;
    }

    fill(0, 10);
    rect(this.posX + 2, this.posY + 2, this.sizeXY, this.sizeXY);
    fill(this.nowColor);
    rect(this.posX, this.posY, this.sizeXY, this.sizeXY);
    //~~~~~~~~
    fill(this.gaugeNowColor);
    rect(this.posX, this.posY + (this.sizeXY / 2) - ((this.internalRandomValue * this.sizeXY) / 2), this.sizeXY, this.internalRandomValue * this.sizeXY);
    //~~~~~~~~
    fill(0);
    textFont(this.font, this.fontSize);
    textAlign(CENTER, CENTER);
    text(this.label, this.posX, this.posY - (this.fontSize / 4));
}

FillBoxButton.prototype.run = function() {
    this.update();
    this.draw();
}

FillBoxButton.prototype.highlight = function(c1, c2) {
    return color(red(c1) + red(c2), green(c1) + green(c2), blue(c1) + blue(c2));
}

FillBoxButton.prototype.hitDetect = function(x1, y1, w1, h1, x2, y2, w2, h2) { // float x1, float y1, float w1, float h1, float x2, float y2, float w2, float h2
    w1 /= 2;
    h1 /= 2;
    w2 /= 2;
    h2 /= 2; 
    if (x1 + w1 >= x2 - w2 && x1 - w1 <= x2 + w2 && y1 + h1 >= y2 - h2 && y1 - h1 <= y2 + h2) {
        return true;
    } else {
        return false;
    }
}

FillBoxButton.prototype.roundToPlaces = function(f1, p) { // float f1, int p
    var f2 = f1 * pow(10, p);
    f2 = round(f2);
    f2 /= pow(10, p);
    return f2;
}
