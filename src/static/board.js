const emptyTile = 1;
const emptyColor = "#ffffff";

const colors = {
    2: "#afafaf",
    4: "#af8f7f",
    8: "#ffaf3f",
    16: "#ff7f1f",
    32: "#ff4f00",
    64: "#ff0000",
    128: "#ff4f00",
    256: "#ff7f3f",
    512: "#ff9f4f",
    1024: "#ff9f2f",
    2048: "#ff9f00",
    4096: "#cf9f00",
    8192: "#cf6f1f",
    16384: "#af6f3f",
    32768: "#5f4f3f",
    65536: "#1f1f1f",
    131072: "#070707"
};

function Board(canvas, fps) {
    this.canvas = canvas;
    this.fps = fps;
    this.ctx = canvas.getContext("2d");
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.border = 4;
    this.borderColor = "black";
    this.textColor = "white";
    this.tileWidth = (this.canvas.width - (this.border * 5)) / 4;
    this.tileHeight = (this.canvas.height - (this.border * 5)) / 4;
    this.ctx.font = Math.min(this.tileWidth, this.tileHeight) / 4 + "px Arial";
    this.score = 0;
    this.tiles = new Array(4);
    for (let i = 0; i < 4; i++)
        this.tiles[i] = new Array(4);
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (i % 2 == 0) // remove
                this.tiles[i][j] = Math.pow(2, i * 4 + j + 1); // this.tiles[i][j] = emptyTile;
            else // remove
                this.tiles[i][3 - j] = Math.pow(2, i * 4 + j + 1); // remove
    this.tiles[0][0] = 4; // remove
    this.positions = new Array(4);
    for (let i = 0; i < 4; i++)
        this.positions[i] = new Array(4);
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            this.positions[i][j] = [i, j];
    this.newTiles = new Array(4);
    for (let i = 0; i < 4; i++)
        this.newTiles[i] = new Array(4);
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            this.newTiles[i][j] = false;

    this.countSpacesRemaining = (function() {
        let spaces = 0;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (this.tiles[i][j] === emptyTile)
                    spaces++;
        return spaces;
    }).bind(this);

    this.newTile = (function() {
        if (this.countSpacesRemaining() === 0)
            throw "no space for new tile";
        let x;
        let y;
        do {
            x = Math.floor(Math.random() * 4);
            y = Math.floor(Math.random() * 4);
        } while (this.tiles[x][y] !== emptyTile);
        this.tiles[x][y] = (Math.floor(Math.random() * 2) + 1) * 2;
    }).bind(this);

    this.drawTile = (function(x, y, color, text) {
        let position = this.positions[x][y];
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.border * (x + 1) + this.tileWidth * position[0], this.border * (y + 1) + this.tileHeight * position[1], this.tileWidth, this.tileHeight);
        this.ctx.fillStyle = this.textColor;
        this.ctx.fillText(text, this.border * (x + 1) + this.tileWidth * position[0] + this.tileWidth / 2, this.border * (y + 1) + this.tileHeight * position[1] + this.tileHeight / 2);
    }).bind(this);

    this.draw = (function() {
        this.ctx.fillStyle = this.borderColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.ctx.fillStyle = emptyColor;
                this.ctx.fillRect(this.border * (i + 1) + this.tileWidth * i, this.border * (j + 1) + this.tileHeight * j, this.tileWidth, this.tileHeight);
                if (this.tiles[i][j] !== emptyTile)
                    this.drawTile(i, j, colors[this.tiles[i][j]], this.tiles[i][j]);
            }
        }
    }).bind(this);

    this.animate = (function(x, y, direction) {
        switch(direction) {
            case "up":
                if (this.positions[x][y][1] > y) {
                    this.positions[x][y][1] = (this.positions[x][y][1] + y) / 2 - 0.01;
                    setTimeout(this.animate, 1000 / this.fps, x, y, direction);
                } else if (this.positions[x][y][1] < y)
                    this.positions[x][y][1] = y;
                break;
            case "down":
                if (this.positions[x][y][1] < y) {
                    this.positions[x][y][1] = (this.positions[x][y][1] + y) / 2 - 0.01;
                    setTimeout(this.animate, 1000 / this.fps, x, y, direction);
                } else if (this.positions[x][y][1] > y)
                    this.positions[x][y][1] = y;
                break;
            case "left":
                if (this.positions[x][y][0] > x) {
                    this.positions[x][y][0] = (this.positions[x][y][0] + x) / 2 - 0.01;
                    setTimeout(this.animate, 1000 / this.fps, x, y, direction);
                } else if (this.positions[x][y][0] < x)
                    this.positions[x][y][0] = x;
                break;
            case "right":
                if (this.positions[x][y][0] < x) {
                    this.positions[x][y][0] = (this.positions[x][y][0] + x) / 2 - 0.01;
                    setTimeout(this.animate, 1000 / this.fps, x, y, direction);
                } else if (this.positions[x][y][0] > x)
                    this.positions[x][y][0] = x;
                break;
        }
    }).bind(this);

    this.moveUp = (function() {
        for (let _ = 0; _ < 3; _++) {
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 4; j++) {
                    if (this.tiles[i][j] !== emptyTile && this.tiles[i][j - 1] === emptyTile) {
                        this.tiles[i][j - 1] = this.tiles[i][j];
                        this.tiles[i][j] = emptyTile;
                        this.positions[i][j - 1][1] = this.positions[i][j][1];
                        this.animate(i, j - 1, "up");
                    } else if (this.tiles[i][j] !== emptyTile && this.tiles[i][j - 1] === this.tiles[i][j] && !this.newTiles[i][j] && !this.newTiles[i][j - 1]) {
                        this.score += this.tiles[i][j] * 2;
                        this.tiles[i][j - 1] = this.tiles[i][j] * 2;
                        this.tiles[i][j] = emptyTile;
                        this.positions[i][j - 1][1] = this.positions[i][j][1];
                        this.animate(i, j - 1, "up");
                        this.newTiles[i][j - 1] = true;
                    }
                }
            }
        }
    }).bind(this);

    this.moveDown = (function() {
        for (let _ = 0; _ < 3; _++) {
            for (let i = 0; i < 4; i++) {
                for (let j = 2; j >= 0; j--) {
                    if (this.tiles[i][j] !== emptyTile && this.tiles[i][j + 1] === emptyTile) {
                        this.tiles[i][j + 1] = this.tiles[i][j];
                        this.tiles[i][j] = emptyTile;
                        this.positions[i][j + 1][1] = this.positions[i][j][1];
                        this.animate(i, j + 1, "down");
                    } else if (this.tiles[i][j] !== emptyTile && this.tiles[i][j + 1] === this.tiles[i][j] && !this.newTiles[i][j] && !this.newTiles[i][j + 1]) {
                        this.score += this.tiles[i][j] * 2;
                        this.tiles[i][j + 1] = this.tiles[i][j] * 2;
                        this.tiles[i][j] = emptyTile;
                        this.positions[i][j + 1][1] = this.positions[i][j][1];
                        this.animate(i, j + 1, "down");
                        this.newTiles[i][j + 1] = true;
                    }
                }
            }
        }
    }).bind(this);

    this.moveLeft = (function() {
        for (let _ = 0; _ < 3; _++) {
            for (let i = 1; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.tiles[i][j] !== emptyTile && this.tiles[i - 1][j] === emptyTile) {
                        this.tiles[i - 1][j] = this.tiles[i][j];
                        this.tiles[i][j] = emptyTile;
                        this.positions[i - 1][j][0] = this.positions[i][j][0];
                        this.animate(i - 1, j, "left");
                    } else if (this.tiles[i][j] !== emptyTile && this.tiles[i - 1][j] === this.tiles[i][j] && !this.newTiles[i][j] && !this.newTiles[i - 1][j]) {
                        this.score += this.tiles[i][j] * 2;
                        this.tiles[i - 1][j] = this.tiles[i][j] * 2;
                        this.tiles[i][j] = emptyTile;
                        this.positions[i - 1][j][0] = this.positions[i][j][0];
                        this.animate(i - 1, j, "left");
                        this.newTiles[i - 1][j] = true;
                    }
                }
            }
        }
    }).bind(this);

    this.moveRight = (function() {
        for (let _ = 0; _ < 3; _++) {
            for (let i = 2; i >= 0; i--) {
                for (let j = 0; j < 4; j++) {
                    if (this.tiles[i][j] !== emptyTile && this.tiles[i + 1][j] === emptyTile) {
                        this.tiles[i + 1][j] = this.tiles[i][j];
                        this.tiles[i][j] = emptyTile;
                        this.positions[i + 1][j][0] = this.positions[i][j][0];
                        this.animate(i + 1, j, "right");
                    } else if (this.tiles[i][j] !== emptyTile && this.tiles[i + 1][j] === this.tiles[i][j] && !this.newTiles[i][j] && !this.newTiles[i + 1][j]) {
                        this.score += this.tiles[i][j] * 2;
                        this.tiles[i + 1][j] = this.tiles[i][j] * 2;
                        this.tiles[i][j] = emptyTile;
                        this.positions[i + 1][j][0] = this.positions[i][j][0];
                        this.animate(i + 1, j, "right");
                        this.newTiles[i + 1][j] = true;
                    }
                }
            }
        }
    }).bind(this);

    this.resetNewTiles = (function() {
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                this.newTiles[i][j] = false;
    }).bind(this);
}
