cardDeck = ["jb", "jb", "jr", "jr","qb","qb", "qr","qr", "kb", "kb","kr", "kr"];
for (let i = 1; i < 11; i++) {
    cardDeck.push(`${i}b`);
    cardDeck.push(`${i}b`);
    cardDeck.push(`${i}r`);
    cardDeck.push(`${i}r`);
}
function loadImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}

for (let i = 0; i < cardDeck.length; i ++) {
    cardDeck[i] = loadImage(`./assets/${cardDeck[i]}.png`);
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}
shuffle(cardDeck);
console.log(cardDeck);
const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

canvas.width =165;
canvas.height = 100;

const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;
let cardWidth = 16;
let cardHeight = 21;

ctx.imageSmoothingEnabled= false

let backImage = loadImage("./assets/back.png");

function vec2(x, y) {
    return {x: x, y: y};
}

class Card {
    constructor(startCoords, endCoords, cardImage) {
        this.startCoords = startCoords;
        this.endCoords = endCoords;
        this.cardImage = cardImage;
        this.angle = Math.atan2(this.endCoords.y-this.startCoords.y, this.endCoords.x-this.startCoords.x);
        this.speed = 15;
        this.finished = false;
        this.distance = Math.hypot(this.endCoords.x - this.startCoords.x, this.endCoords.y - this.startCoords.y)
        this.currentCoords = vec2(this.startCoords.x, this.startCoords.y);
    }
    update() {
        let distanceTraveled = Math.hypot(this.currentCoords.x - this.startCoords.x, this.currentCoords.y - this.startCoords.y);
        console.log(this.currentCoords);
        console.log(distanceTraveled);
        console.log(this.distance);
        if (distanceTraveled > this.distance) {
            this.currentCoords.x = this.endCoords.x;
            this.currentCoords.y = this.endCoords.y;
            this.finished = true;
        } else {
            this.currentCoords.x += this.speed * Math.cos(this.angle);
            this.currentCoords.y += this.speed * Math.sin(this.angle);
            console.log("HELLO");
        }
    }

    draw() {
        ctx.drawImage(this.cardImage, Math.floor(this.currentCoords.x), Math.floor(this.currentCoords.y));
    }
}

let xOffset = 12;
let yOffset = 10;
let gap = 5;
let startCoords = {
    x: (cardWidth+gap)*7-9,
    y: (cardHeight-8)*5+yOffset
}

let cardCount = 0;
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 7; j++) {
        let card = cardDeck[cardCount];
        cardDeck[cardCount] = new Card(startCoords,vec2(xOffset + (gap+cardWidth)*j, yOffset + (cardHeight - 13)*i), card)
        cardCount++;
    }
}

function placeCards() {

}
let cardCounter = 0;
function gameUpdate() {
    if (cardDeck[cardCounter].finished != true) {
        console.log(cardCounter);
        console.log(cardDeck[cardCounter].finished);
        cardDeck[cardCounter].update();
    } else if (cardDeck[cardCounter].finished == true) {
        console.log("Why");
        if (cardCounter < 34) {
            cardCounter++;
        }
    }
}
console.log(cardDeck);

function gameDraw() {
    for (let i = 0; i < 35; i++) {
        cardDeck[i].draw();
    }
    ctx.drawImage(backImage,(cardWidth+gap)*7-9,(cardHeight-8)*5+yOffset);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);
    
    gameUpdate();
    gameDraw()
    
}
gameLoop();