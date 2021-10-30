const canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");
let debug_p = document.getElementById("debug");

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + ", " + this.y;
    }

    set(x,y) {
        this.x = x;
        this.y = y;
    }

    add(x,y) {
        this.x += x;
        this.y += y;
    }
}

class Vector extends Coord {
    constructor(x,y,l) {
        super(x,y);
        this.l = 0;
    }

    toString() {
        return super.toString() + ", " + this.l;
    }
}


class ShipData {
    constructor() {
        this.coord = new Coord();
        this.heading = new Vector();
    }

    getVelocity() {
        // 5, 5 ; 6, 6 -> 1, 1
        let sv_x = shipData.heading.x - shipData.coord.x;
        let sv_y = shipData.heading.y - shipData.coord.y;
        return [sv_x, sv_y];
    }

    setVelocity(x, y) {

    }


}

class GameData {

    constructor() {
        this.thrustCoord = new Coord(0,0);
        this.shipData = new ShipData();
    }

}

let gameData = new GameData();
let shipData = gameData.shipData;

function resetShip() {
    shipData.coord.x = canvas.clientWidth / 2;
    shipData.coord.y = canvas.clientHeight / 2;
    shipData.heading.set(shipData.coord.x, shipData.coord.y);
}

resetShip()

// This will do any math or calculation related to game statistics
function updateGame() {
    // Need to add thrust to current vector, then move the ship
    // Find thrust "velocity" -> compare to ship position

    let tv_x = gameData.thrustCoord.x - shipData.coord.x;
    let tv_y = gameData.thrustCoord.y - shipData.coord.y;
    console.log(`tv_x: ${tv_x}, tv_y: ${tv_y}`)
    // Add thrust to ship velocity
    let sv_x = 0;
    let sv_y = 0;
    [sv_x, sv_y] = shipData.getVelocity();
    console.log(`sv_x: ${sv_x}, sv_y: ${sv_y}`)
    // Recalculate ship heading coordinate
    sv_x += tv_x;
    sv_y += tv_y;
    // Move the ship by moving it and heading and thrust by the final velocity
    shipData.coord.x += sv_x;
    shipData.coord.y += sv_y;
    // Heading needs to be new velocity relative to ship
    shipData.heading.x = shipData.coord.x + sv_x;
    shipData.heading.y = shipData.coord.y + sv_y ;
    gameData.thrustCoord.x = shipData.coord.x;
    gameData.thrustCoord.y = shipData.coord.y;
}

function mouseMoveHandler(e) {
    debug_p.innerText = "x " + e.x + " ,y: " + e.y;
}

canvas.onmousemove = mouseMoveHandler;


function mouseDownHandler(e) {
    gameData.thrustCoord.set(e.x, e.y);
    // shipData.coord.x = e.x;
    // shipData.coord.y = e.y;
    draw();
}

canvas.onmousedown = mouseDownHandler

function drawBorder() {
    let c_w = canvas.clientWidth;
    let c_h = canvas.clientHeight;
    debug_p.innerText = c_w.toString();
    context.beginPath();
    context.rect(0, 0, c_w, c_h)
    context.lineWidth = 2;
    context.strokeStyle = "red";
    context.stroke();
    context.strokeStyle = "black";


    // canvasCtx
}

function drawShip() {
    context.beginPath()
    // Draw the ship
    context.arc(shipData.coord.x, shipData.coord.y, 5, 0, Math.PI * 2);
    let savedStyle = context.fillStyle
    context.fillStyle = "Red";
    context.fill();
    context.fillStyle = savedStyle;
    // context.strokeRect(shipData.coord.x, shipData.coord.y, 10,10);
    // Draw the current vector
    // Draw heading point
    context.beginPath();
    savedStyle = context.fillStyle
    context.fillStyle = "green"
    context.arc(shipData.heading.x, shipData.heading.y, 3, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = savedStyle;
    // Draw the heading line
    context.beginPath()
    context.moveTo(shipData.coord.x, shipData.coord.y)
    context.lineWidth = 1;
    savedStyle = context.fillStyle
    context.strokeStyle = "Green";
    context.lineTo(shipData.heading.x, shipData.heading.y);
    context.stroke()
    context.strokeStyle = savedStyle;
}

function drawGame() {
    // Draws thrust point
    context.beginPath();
    context.arc(gameData.thrustCoord.x, gameData.thrustCoord.y, 3, 0, Math.PI * 2);
    context.fill();
    // Draw the thrust line
    context.beginPath()
    context.moveTo(shipData.coord.x, shipData.coord.y)
    context.lineWidth = 1;
    let savedStyle = context.fillStyle
    context.strokeStyle = "Blue";
    context.lineTo(gameData.thrustCoord.x, gameData.thrustCoord.y);
    context.stroke()
    context.strokeStyle = savedStyle;
}

// This is where game rendering takes place
function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);
    drawBorder();
    drawGame();
    drawShip();
}

function nextTurnHandler () {
    updateGame();
    draw();
}

function clearBtnHandler() {
    resetShip();
    context.clearRect(0,0, canvas.width, canvas.height);
}

document.getElementById("nextTurnBtn").onclick = nextTurnHandler;
document.getElementById("clearBtn").onclick = clearBtnHandler;

function onLoadHandler() {
    draw();
}
onload = onLoadHandler
