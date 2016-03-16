"use strict";

function GridGuy(x, y, w, h, s, cc, dc, lc, rc) { // float x, float y, float w, float h, String s, float cc, int dc, int lc, int rc
    //this.renderHighQuality = false;

    this.debugColors = false;
    this.strokeLines = false;

    this.rulesArray = [ "NWcorner", "NEcorner", "SWcorner", "SEcorner", "Nrow", "Srow", "Wrow", "Erow" ];

    this.switchArray = [ false, false, false, false, false, false, false, false ];

    this.strokeColor = color(0);
    this.fillColorOrig = color(0);
    this.fillColor = this.fillColorOrig;
    
    this.fillColorArray = [
      color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 0, 255), color(50), color(60), color(70), color(80)
    ];
    
    this.hoveredColor = color(255, 0, 0);
    this.clickedColor = color(255, 255, 0);

    this.hovered = false;
    this.clicked = false;
    this.kaboom = false;

    this.posX = x;
    this.posY = y;
    this.guyWidth = w;
    this.guyHeight = h;
    this.applyRule = s;

    this.chaos = abs(1.0 - cc);
    this.delayCountDownOrig = floor(random(dc * this.chaos, dc));
    this.delayCountDown = this.delayCountDownOrig;
    this.lifeCountDownOrig = floor(random(lc * this.chaos, lc));
    this.lifeCountDown = this.lifeCountDownOrig;
    this.respawnCountDownOrig = floor(random(rc * this.chaos, rc));
    this.respawnCountDown = this.respawnCountDownOrig;
    
    for (var i = 0; i < this.rulesArray.length; i++) {
        if (this.applyRule == this.rulesArray[i]) {
            this.switchArray[i] = true;
        }
    }

    //if(this.renderHighQuality) {
        //this.strokeLines = false;
    //} else {
    this.strokeLines = true;
    //}
}

GridGuy.prototype.run = function() {
    this.update();
    this.draw();
}

GridGuy.prototype.update = function() {
    if (this.hitDetect(mouseX, mouseY, 0, 0, this.posX, this.posY, this.guyWidth, this.guyHeight)) {
        this.hovered = true;
    } else {
        this.hovered = false;
    }

    if (this.hovered && mouseIsPressed) {
        this.mainFire();
    } else {
        //this.clicked = false;
    }

    if (this.kaboom) {
        if (this.delayCountDown>0) {
            this.delayCountDown--;
        } else {
            this.kaboom = false;
            this.clicked = true;
            this.delayCountDown = this.delayCountDownOrig;
        }
    }

    if (this.clicked) {
        if (this.lifeCountDown > 0) {
            this.lifeCountDown--;
        } else {
            this.clicked = false;
        }
    }

    if (this.lifeCountDown == 0 && this.respawnCountDown > 0) {
        this.respawnCountDown--;
    } 
    else if (this.respawnCountDown == 0) {
        this.lifeCountDown = this.lifeCountDownOrig;
        this.respawnCountDown = this.respawnCountDownOrig;
    }
}

GridGuy.prototype.mainFire = function() {
    this.clicked = true;
    this.kaboom = false;
    this.delayCountDown = this.delayCountDownOrig;
    this.lifeCountDown = this.lifeCountDownOrig;
    this.respawnCountDown = this.respawnCountDownOrig;
}

GridGuy.prototype.draw = function() {
    this.fillColor = this.fillColorOrig;
    noStroke();

    if (this.debugColors) {
        for (var i = 0; i < this.switchArray.length; i++) {
            if (this.switchArray[i]) {
                this.fillColor = this.fillColorArray[i];
            }
        }
    }

    if (this.strokeLines) {
        stroke(this.strokeColor);
    }

    if (this.hovered && !this.clicked) {
        //if (!this.renderHighQuality) {
            this.fillColor = this.highlight(this.fillColor, this.hoveredColor);
        //}
    } else if(this.clicked) {
        this.fillColor = this.highlight(this.fillColor, this.clickedColor);
    }

    //if (this.renderHighQuality) {
        //this.drawPoint();
    //} else {
        this.drawRect();
    //}
}

GridGuy.prototype.drawPoint = function() {
    stroke(this.fillColor);
    strokeWeight(5);
    point(this.posX, this.posY);
}

GridGuy.prototype.drawRect = function() {
    fill(this.fillColor);
    rectMode(CENTER);
    rect(this.posX, this.posY, this.guyWidth, this.guyHeight);
}

GridGuy.prototype.highlight = function(c1, c2) {
    return color(red(c1) + red(c2), green(c1) + green(c2), blue(c1) + blue(c2));
}

GridGuy.prototype.hitDetect = function(x1, y1, w1, h1, x2, y2, w2, h2) { // float x1, float y1, float w1, float h1, float x2, float y2, float w2, float h2
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
