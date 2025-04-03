let cardDeck = ["jb", "jb", "jr", "jr","qb","qb", "qr","qr", "kb", "kb","kr", "kr"];
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
function createAudio(src) {
    var audio = document.createElement('audio');
    audio.volume = 1;
    //audio.loop   = options.loop;
    audio.src = src;
    audio.playbackRate = 7;
    return audio;
}
for (let i = 0; i < cardDeck.length; i ++) {
    cardDeck[i] = loadImage(`./assets/${cardDeck[i]}.png`);
}
let flipCardSound = createAudio("./sound/flipcard.mp3");

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
const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

canvas.width =175;
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

let cardConvert = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "j": 11,
    "q": 12,
    "k": 13,

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
        this.name = this.cardImage.src.split("/");
        this.name = this.name[this.name.length -1].split(".png")[0];
        this.number = cardConvert[this.name];
    }
    update() {
        let distanceTraveled = Math.hypot(this.currentCoords.x - this.startCoords.x, this.currentCoords.y - this.startCoords.y);
        if (distanceTraveled > this.distance) {
            this.currentCoords.x = this.endCoords.x;
            this.currentCoords.y = this.endCoords.y;
            this.finished = true;
        } else {
            this.currentCoords.x += this.speed * Math.cos(this.angle);
            this.currentCoords.y += this.speed * Math.sin(this.angle);
        }
    }

    draw() {
        ctx.drawImage(this.cardImage, Math.floor(this.currentCoords.x), Math.floor(this.currentCoords.y));
    }
}

let xOffset = 5;
let yOffset = 10;
let gap = 5;
let startCoords = {
    x: (cardWidth+gap)*7 + 9,
    y: (cardHeight-8)*5+yOffset
}

let cardCount = 0;
let cardGrid = [];
for (let i = 0; i < 5; i++) {
    let cardRow = [];
    for (let j = 0; j < 7; j++) {
        let card = cardDeck[cardCount];
        cardDeck[cardCount] = new Card(startCoords,vec2(xOffset + (gap+cardWidth)*j, yOffset + (cardHeight - 13)*i), card)
        cardRow.push(cardDeck[cardCount]);
        cardCount++;
    }
    cardGrid.push(cardRow);
    cardRow = [];
}
console.log(cardGrid);
let clickCards = [];
for (let col = 0; col < cardGrid[0].length ; col++) {
    for (let row = 0; row < cardGrid.length; row++) {
        if (row == cardGrid.length -1 ) {
            clickCards.push(cardGrid[row][col]);
        }
    }
}
console.log(clickCards);
let cardCounter = 0;
function gameUpdate() {
    if (cardDeck[cardCounter].finished != true) {
        cardDeck[cardCounter].update();
    } else if (cardDeck[cardCounter].finished == true) {
        if (cardCounter < 34) {
            cardCounter++;
            flipCardSound.play();
        }
    }
}

function gameDraw() {
    for (let i = 0; i < 35; i++) {
        cardDeck[i].draw();
    }
    ctx.drawImage(backImage,startCoords.x,startCoords.y);
    ctx.strokeStyle = "red"; // Bounding box color
    for (let i = 0; i < clickCards.length; i++) {
        let clickCard = clickCards[i];
        ctx.strokeRect(clickCard.endCoords.x, clickCard.endCoords.y, cardWidth, cardHeight);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);
    
    gameUpdate();
    gameDraw()
    
}
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / 4) + 1;
    let y = Math.floor((event.clientY - rect.top) / 4);
    return {x: x, y: y};
}

document.addEventListener('pointerdown', (event) => {
    //console.log("MOUSE CLICKED");
    var mouseCoords = getMousePosition(canvas, event);
    console.log(mouseCoords);
    console.log(clickCards);
    //console.log(clickCards);
    for (let i = 0; i < clickCards.length; i++) {
        if ((mouseCoords.x < clickCards[i].endCoords.x + cardWidth && mouseCoords.x > clickCards[i].endCoords.x) &&
        (mouseCoords.y > clickCards[i].endCoords.y && mouseCoords.y < clickCards[i].endCoords.y + cardHeight)) {
            console.log(clickCards[i])
            console.log(`You clicked ${clickCards[i].name}`)
        }
    }
    // if (die && (mouseCoords.x < restartX + retryButton.width && mouseCoords.x > restartX) && 
    // (mouseCoords.y > restartY && mouseCoords.y < restartY + retryButton.height)) {
    //     console.log("Clicked restart");
    //     die = false;
    //     POINTS = 0;
    //     totalClicked = 0;
    //     currentFruit = newFruit();
    //     selecter.arrowPoint = 1;
    // }
});

gameLoop();