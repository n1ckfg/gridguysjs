"use strict";

function Button(x, y, s, oc, fs, d) { // float x, float y, float s, color oc, int fs, String d
    this.hovered=false;
    this.clicked=false;

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

Button.prototype.update = function() {
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
}

Button.prototype.draw = function() {
    ellipseMode(CENTER);
    noStroke();
    if (this.hovered && !this.clicked) {
        this.nowColor = this.hoverColor;
    } else if (this.hovered && this.clicked) {
        this.nowColor = this.clickColor;
    } else if (!this.hovered && !this.clicked) {
        this.nowColor = this.offColor;
    }
    fill(0, 10);
    ellipse(this.posX + 2, this.posY + 2, this.sizeXY, this.sizeXY);
    fill(this.nowColor);
    ellipse(this.posX, this.posY, this.sizeXY, this.sizeXY);
    fill(0);
    textFont(this.font, this.fontSize);
    textAlign(CENTER, CENTER);
    text(this.label, this.posX, this.posY - (this.fontSize / 4));
}

Button.prototype.run = function() {
    this.update();
    this.draw();
}

Button.prototype.highlight = function(c1, c2) {
    return color(red(c1) + red(c2), green(c1) + green(c2), blue(c1) + blue(c2));
}

Button.prototype.hitDetect = function(x1, y1, w1, h1, x2, y2, w2, h2) { // float x1, float y1, float w1, float h1, float x2, float y2, float w2, float h2
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

