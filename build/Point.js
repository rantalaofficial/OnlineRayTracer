"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceSquareTo(point2) {
        let xDiff = this.x - point2.x;
        let yDiff = this.y - point2.y;
        return xDiff * xDiff + yDiff * yDiff;
    }
    deltaTo(point2) {
        return new Point(point2.x - this.x, point2.y - this.y);
    }
}
