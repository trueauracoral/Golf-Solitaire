let cardDeck = [];
for (let i = 1; i < 14; i++) {
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
let hiddenImage = loadImage("./assets/hiddencard.png")

function vec2(x, y) {
    return {x: x, y: y};
}

let lastClickedCard = null;

class Card {
    constructor(startCoords, endCoords, cardImage) {
        this.startCoords = startCoords;
        this.endCoords = endCoords;
        this.cardImage = cardImage;
        this.angle = 0;
        this.speed = 2;
        this.finished = false;
        this.distance = 0;
        this.currentCoords = vec2(this.startCoords.x, this.startCoords.y);
        this.name = this.cardImage.src.split("/");
        this.name = this.name[this.name.length -1].split(".png")[0];
        this.number = cardConvert[this.name[0]];
        this.clicked = false;
    }
    update() {
        this.angle =  Math.atan2(this.endCoords.y-this.startCoords.y, this.endCoords.x-this.startCoords.x);
        this.distance = Math.hypot(this.endCoords.x - this.startCoords.x, this.endCoords.y - this.startCoords.y)
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
function findClickable() {
    clickCards = [];
    for (let col = 0; col < cardGrid[0].length ; col++) {
        for (let row = 0; row < cardGrid.length; row++) {
            if (row == cardGrid.length -1 ) {
                for (let card = row; card >= 0; card--) {
                    if (cardGrid[card][col].clicked != true) {
                        console.log(card);
                        clickCards.push({"row": card, "col": col});
                        break;
                    }
                }
            }
        }
    }
    console.log(clickCards);
}

findClickable();

let cardCounter = 0;
function gameUpdate() {
    //console.log(cardDeck);
    for (let card = 0; card < 35; card++) {
        if (cardDeck[card].finished != true) {
            cardDeck[card].update();
        } else if (cardDeck[card].finished == true) {
            flipCardSound.play();
        }
    }
}

function gameDraw() {
    for (let i = 0; i < 35; i++) {
        if (cardDeck[i].clicked == false) {
            cardDeck[i].draw();
        }
    }
    if (lastClickedCard) {
        lastClickedCard.draw();
    }
    for (let i = 0; i < offsetCounter; i++) {
        ctx.drawImage(hiddenImage, startCoords.x-27-2*i+cardWidth, startCoords.y);
    }
    ctx.drawImage(backImage,startCoords.x,startCoords.y);
    ctx.strokeStyle = "red"; // Bounding box color
    for (let i = 0; i < clickCards.length; i++) {
        let clickCard = cardGrid[clickCards[i].row][clickCards[i].col];
        ctx.strokeRect(parseInt(clickCard.endCoords.x), clickCard.endCoords.y, cardWidth, cardHeight);
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

let offsetCounter = 0;
document.addEventListener('pointerdown', (event) => {
    //console.log("MOUSE CLICKED");
    var mouseCoords = getMousePosition(canvas, event);
    console.log(mouseCoords);
    console.log(clickCards);
    //console.log(clickCards);
    for (let i = 0; i < clickCards.length; i++) {
        let clickableCard = cardGrid[clickCards[i].row][clickCards[i].col];
        if ((mouseCoords.x < clickableCard.endCoords.x + cardWidth && mouseCoords.x > clickableCard.endCoords.x) &&
        (mouseCoords.y > clickableCard.endCoords.y && mouseCoords.y < clickableCard.endCoords.y + cardHeight+yOffset)) {
            console.log(clickableCard);
            console.log(`You clicked ${clickableCard.name}`);
            clickableCard.clicked = true;
            clickableCard.startCoords = vec2(clickableCard.currentCoords.x, clickableCard.currentCoords.y);
            clickableCard.endCoords = vec2(startCoords.x -25 - 2*offsetCounter, startCoords.y);
            offsetCounter++;
            clickableCard.finished = false;
            clickableCard.speed = 15;
            findClickable();
            lastClickedCard = clickableCard;
        }
    }
});

gameLoop();