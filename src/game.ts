import { GameMap } from './map.js';
import { Player } from './player.js';

export class Game {
    ctx: CanvasRenderingContext2D;
    gameMap: GameMap;
    player: Player;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;

        this.gameMap = new GameMap(50, 36);
        this.gameMap.addRoom(5, 5, 10, 8);
        this.gameMap.addRoom(20, 10, 15, 12);
        this.gameMap.render(ctx, 0, 0);

        this.player = new Player();
        this.player.x = 10;
        this.player.y = 10;
        this.player.glyph = '@';
        this.player.color = '#ff0000';

        window.addEventListener('keydown', this.onKeyDown);

        this.render();
    }

    dispose(): void {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    render(): void {
        this.gameMap.render(this.ctx, 0, 0);
        this.player.render(this.ctx);
    }

    tick(): void {
        this.player.tick();
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        let shouldTick = false;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.movePlayer(0, -1);
                shouldTick = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.movePlayer(0, 1);
                shouldTick = true;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.movePlayer(-1, 0);
                shouldTick = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movePlayer(1, 0);
                shouldTick = true;
                break;
        }

        if (shouldTick) {
            e.preventDefault();
            this.tick();
            this.render();
        }
    };

    private movePlayer(dx: number, dy: number): void {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        this.player.x = newX;
        this.player.y = newY;
    }
}
