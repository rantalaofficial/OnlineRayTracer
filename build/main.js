"use strict";
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 800;
const canvasHeight = 500;
const canvasRect = canvas.getBoundingClientRect();
const rowRenderingInterval = 100;
let mousePressed = false;
let selectedTool = 0;
let mouseLoc = new Point(0, 0);
let sceneObjs = [];
/*
-1 = Empty
0 = Wall
1 > Light with that intensity
*/
const refreshingInterval = 10;
function resetScene(canvasContext, sceneObjects, width, height) {
    for (let y = 0; y < width; y++) {
        sceneObjects[y] = [];
        for (let x = 0; x < height; x++) {
            sceneObjects[y][x] = -1;
        }
    }
    resetCanvas(canvasContext, width, height);
}
function addSceneObject(canvasContext, sceneObjects, loc, selectedTool) {
    if (!canvasContext)
        return;
    if (selectedTool === -1 || selectedTool === 0) {
        let pixelPos = new Point(0, 0);
        for (let y = -20; y < 20; y++) {
            for (let x = -20; x < 20; x++) {
                if (x * x + y * y > 200)
                    continue;
                pixelPos.x = loc.x + x;
                pixelPos.y = loc.y + y;
                if (pixelPos.x >= 0 && pixelPos.x < canvasWidth && pixelPos.y >= 0 && pixelPos.y < canvasHeight) {
                    sceneObjects[pixelPos.y][pixelPos.x] = selectedTool;
                }
            }
        }
        canvasContext.fillStyle = (selectedTool === 0) ? "gray" : 'black';
        canvasContext.beginPath();
        canvasContext.arc(mouseLoc.x, mouseLoc.y, 14, 0, 2 * Math.PI);
        canvasContext.fill();
    }
    else if (selectedTool > 0) {
        sceneObjects[loc.y][loc.x] = selectedTool;
        drawRectangle(canvasContext, loc, 1, 1, 'red');
    }
}
$('input[type=radio][name=toolRadio]').on('change', function () {
    selectedTool = Number($(this).val());
});
document.body.addEventListener('mouseup', () => mousePressed = false);
document.body.addEventListener('mousedown', () => {
    mousePressed = true;
    if (selectedTool > 0) {
        addSceneObject(ctx, sceneObjs, mouseLoc, selectedTool);
    }
});
canvas.addEventListener('mousemove', (event) => {
    mouseLoc.x = Math.round(event.clientX - canvasRect.left);
    mouseLoc.y = Math.round(event.clientY - canvasRect.top);
    if (selectedTool <= 0 && mousePressed) {
        addSceneObject(ctx, sceneObjs, mouseLoc, selectedTool);
    }
});
$('#resetSceneBtn').on('click', () => {
    resetScene(ctx, sceneObjs, canvasWidth, canvasHeight);
});
$('#renderSceneBtn').on('click', () => {
    startRender(ctx, sceneObjs, rowRenderingInterval, canvasWidth, canvasHeight);
});
resetScene(ctx, sceneObjs, canvasWidth, canvasHeight);
