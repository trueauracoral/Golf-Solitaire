# Golf Solitaire
This is Golf Solitaire written in JS canvas

# TODO
- [X] Create Assets
- [X] Draw Cards
- [X] Animate Cards going to position
- [X] Be able to detect click on cards
- [ ] set active card
- [X] Move the card from the field to the bottom in a line.
- [ ] Make sure that you can only click card that matches your active
- [ ] Count how many cards are in the pile
- [ ] Count how many clicks you did.
## Polish
- [X] Add sfx
- [ ] Timer
- [ ] Record System

# Dev Log
## 3/29/25
Implemented card assets, shuffled them and also animated them going onto the screen from the card pile. That took a while.
## 4/2/25
I can now detect click on theorettically clickable cards.
## 4/4/25
Implemented the ability to click on the clickable cards and they know where to move
By doing this the animation improved because they all simulataniously move there necessary position. 
However they go to the wrong angle
## 4/5/25
Fixed the cards going at the wrong angle and they instead go to a line like how it works in pocket card jockey
## 4/6/25
Made the line that the cards go into look better by appending the right edge of the card and drawing that. 