class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceSquareTo(point2: Point): number {
        let xDiff: number = this.x - point2.x;
        let yDiff: number = this.y - point2.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    deltaTo(point2: Point): Point {
        return new Point(point2.x - this.x, point2.y - this.y);
    }
}