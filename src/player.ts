import { Actor } from "./actor";
import { Snake } from "./enemies/snake";
import { Game } from "./game";

export class Player implements Actor {
    type: string = 'player';
    x: number = 0;
    y: number = 0;
    glyph: string = '@';
    color: string = '#0000ff';

    tick(game: Game): void {
        // TODO: resolve time-based effects like hunger, healing
    }

    handleCollision(game: Game, actor: Actor): void {
        game.statusText = `You bumped into a ${actor.type}!`;

        if (actor.type === 'snake') {
            const snake = actor as Snake;
            snake.aggro = true;
        }
    }
}
