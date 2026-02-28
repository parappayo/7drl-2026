import { Actor } from "../actor";
import { Game } from "../game";

export class Snake implements Actor {
    type: string = 'snake';
    x: number;
    y: number;
    glyph: string = 's';
    color: string = '#03b403';
    direction: number = 1;
    aggro: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    tick(game: Game): void {
        if (this.aggro) {
            // TODO: attack player if adjacent, otherwise move towards player
            return;
        }

        if (game.gameMap.isWalkable(this.x + this.direction, this.y)) {
            this.x += this.direction;
        } else {
            this.direction *= -1;
        }
    }
}
