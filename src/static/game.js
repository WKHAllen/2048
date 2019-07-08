function arrayClone(arr) {
    let clone = [];
    for (let i = 0; i < arr.length; i++) {
        clone.push(arr[i].slice(0));
    }
    return clone;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++)
        for (let j = 0; j < arr1[i].length; j++)
            if (arr1[i][j] !== arr2[i][j])
                return false;
    return true;
}

class Game {
    constructor(fps) {
        this.board = new Board(document.getElementById("game"), fps);
        document.addEventListener("keydown", (event) => this.keyPress(event));
        setInterval(this.board.draw, 1000 / fps);
    }

    move(keyCode) {
        let tiles = arrayClone(this.board.tiles);
        switch(keyCode) {
            case 37:
                this.board.moveLeft();
                break;
            case 38:
                this.board.moveUp();
                break;
            case 39:
                this.board.moveRight();
                break;
            case 40:
                this.board.moveDown();
                break;
        }
        this.board.resetNewTiles();
        return !arraysEqual(this.board.tiles, tiles);
    }

    keyPress(event) {
        if ([37, 38, 39, 40].includes(event.keyCode)) {
            if (this.move(event.keyCode)) {
                if (this.board.countSpacesRemaining() !== 0) {
                    this.board.newTile();
                } else { // check if move can be made
                    // game over
                }
            }
        }
    }
}

window.addEventListener("load", function() {
    let game = new Game(30);
    game.board.newTile();
});
