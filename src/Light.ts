class Light {
    loc: Point;
    power: number;

    constructor(loc: Point, power: number) {
        this.loc = loc;
        this.power = power * power;
    }
}