let renderingY: number = 0;
let renderingStartTime: number;

function drawRectangle(canvasContext: any, loc: Point, width: number, height: number, color: string) {
    if (!canvasContext) return;
    canvasContext.fillStyle = color;
    canvasContext.fillRect(loc.x, loc.y, width, height);
}

function rgbaToStr(red: number, green: number, blue: number, opacity: number): string {
    return `rgba(${red}, ${green}, ${blue})`;
}

function rgbaToHex(red: number, green: number, blue: number, opacity: number): string {
    function componentToHex(c: number) {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return '#' + componentToHex(red * opacity) + componentToHex(green * opacity) + componentToHex(blue * opacity);
}

function resetCanvas(canvasContext: any, width: number, height: number) {
    drawRectangle(canvasContext, new Point(0, 0), width, height, 'black');
}

function isRayCollisions(sceneObjects: number[][], p1: Point, p2: Point) {
    // OLD ALGORITHM
    // if (Math.abs(p1.x - p2.x) < 10) {
    //     if (p1.y < p2.y) {
    //         for (let y = p1.y; y < p2.y; y++) {
    //             if (walls[y][p1.x]) return true;
    //         }
    //     } else {
    //         for (let y = p1.y; y > p2.y; y--) {
    //             if (walls[y][p1.x]) return true;
    //         }
    //     }
    //     return false;
    // }

    // let k: number = (p1.y - p2.y) / (p1.x - p2.x);
    // let b: number = p1.y - k * p1.x;

    // function getY(x: number): number {
    //     return Math.round(k * x + b);
    // }

    // let points: Point[] = [];
    // if (p1.x < p2.x) {
    //     for (let x = p1.x; x < p2.x; x++) {
    //         if (walls[getY(x)][x]) return true;
    //     }
    // } else {
    //     for (let x = p1.x; x > p2.x; x--) {
    //         if (walls[getY(x)][x]) return true;
    //     }
    // }

    // return false;

    let vectorLen = Math.sqrt(p1.distanceSquareTo(p2));
    let delta = p1.deltaTo(p2);

    let unitVector: Point = new Point(delta.x / vectorLen, delta.y / vectorLen); 

    let currentX: number;
    let currentY: number;
    for (let i = 1; i < vectorLen; i += 1) {
        //console.log(Math.round(i*unitVector.x+p1.x), Math.round(i*unitVector.y+p1.y));
        currentX = Math.round(i * unitVector.x + p1.x);
        currentY = Math.round(i * unitVector.y + p1.y);
        if (sceneObjects[currentY][currentX] === 0) return true;
    }

    return false;
}

function getPixelColor(sceneObjects: number[][], lights: Light[], pixelLoc: Point): string {
    //if (pixelLoc.x % 2 !== 0 && pixelLoc.y % 2 !== 0) return 'black';

    let currentSceneObject: number = sceneObjects[pixelLoc.y][pixelLoc.x];
    if (currentSceneObject === 0) {
        return 'gray';
    } else if (currentSceneObject > 0) {
        return 'red'
    }

    let opacity: number = 0
    let distance: number;
    for (let i = 0; i < lights.length; i++) {
        distance = pixelLoc.distanceSquareTo(lights[i].loc)

        if (distance < lights[i].power) {

            if (isRayCollisions(sceneObjects, pixelLoc, lights[i].loc)) continue;

            opacity += 1 - distance / lights[i].power; 
        }
    }

    opacity = Math.min(1, opacity);

    return rgbaToHex(255, 255, 255, opacity);
}

function render(canvasContext: any, sceneObjects: number[][], lights: Light[], rowRenderingInterval: number, width: number, height: number) {
    if (renderingY >= canvasHeight) {
        let renderingTime: number = new Date().getTime() - renderingStartTime;
        $('#renderingTimeText').html(`${renderingTime} ms`)
        return;
    };

    let pixelLoc: Point;
    while (renderingY < height) {
        for (let x = 0; x < canvasWidth; x++) {
            pixelLoc = new Point(x, renderingY);
            drawRectangle(canvasContext, pixelLoc, 1, 1, getPixelColor(sceneObjects, lights, pixelLoc))
        }

        renderingY++;
        if (renderingY % rowRenderingInterval === 0) break;
    }

    window.requestAnimationFrame(() => {
        //console.log(`Row ${renderingY} rendered.`)
        render(canvasContext, sceneObjects, lights, rowRenderingInterval, width, height);
    });
}

function startRender(canvasContext: any, sceneObjects: number[][], rowRenderingInterval: number, width: number, height: number) {
    $('#renderingTimeText').html("rendering...");
    renderingStartTime = new Date().getTime();

    let lights: Light[] = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (sceneObjects[y][x] > 0) {
                lights.push(new Light(new Point(x, y), sceneObjects[y][x]))
            }
        }
    }

    renderingY = 0;
    //resetCanvas(canvasContext, width, height)
    render(canvasContext, sceneObjects, lights, rowRenderingInterval, width, height);
}