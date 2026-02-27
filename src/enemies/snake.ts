import { Actor } from "../actor";
import { Game } from "../game";

export class Snake implements Actor {
    type: string = 'snake';
    x: number;
    y: number;
    glyph: string = 's';
    color: string = '#03b403';
    direction: number = 1;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    tick(game: Game): void {
        if (game.gameMap.isWalkable(this.x + this.direction, this.y)) {
            this.x += this.direction;
        } else {
            this.direction *= -1;
        }
    }
}
