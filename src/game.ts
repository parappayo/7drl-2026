import { Actor } from './actor.js';
import { GameMap } from './map.js';
import { Player } from './player.js';
import { Snake } from './enemies/snake.js';
import { Log } from './log.js';

export class Game {
    ctx: CanvasRenderingContext2D;
    statusText = "hello there";
    gameMap: GameMap;
    player: Player;
    actors: Actor[] = [];
    log: Log = new Log();

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;

        this.gameMap = new GameMap(50, 36);
        this.gameMap.addRoom(5, 5, 10, 8);
        this.gameMap.addRoom(20, 10, 15, 12);
        this.gameMap.addDoor(14, 11)
        this.gameMap.addDoor(20, 11)
        this.gameMap.addHorizontalCorridor(11, 15, 20);

        const snake = new Snake(7, 7);
        this.actors.push(snake);

        this.player = new Player();
        this.player.x = 10;
        this.player.y = 10;
        this.player.glyph = '@';
        this.player.color = '#ff0000';
        this.actors.push(this.player);

        window.addEventListener('keydown', this.onKeyDown);

        this.calculateSeenTiles();
        this.render();
    }

    dispose(): void {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    render(): void {
        this.renderMap();
        this.actors.forEach(actor => this.renderActor(this.ctx, actor));
        this.renderStatusText();

        console.log("is log open = ", this.log.isOpen);
        if (this.log.isOpen) {
            this.renderLog();
        }
    }

    renderMap(): void {
        this.ctx.clearRect(0, 0, this.gameMap.width * 16, this.gameMap.height * 16 + 20);
        this.ctx.font = '12px monospace';
        this.gameMap.render(this.ctx, 0, 0);
    }

    renderActor(ctx: CanvasRenderingContext2D, actor: Actor): void {
        ctx.fillStyle = this.gameMap.floorColor;
        ctx.fillRect(actor.x * 16, actor.y * 16, 16, 16);
        ctx.fillStyle = actor.color;
        ctx.fillText(actor.glyph, actor.x * 16 + 4, actor.y * 16 + 12);
    }

    renderStatusText(): void {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(this.statusText, 4, 16 * this.gameMap.height + 12);
    }

    private renderLog(): void {
        const logWidth = 300;
        const logHeight = 200;
        const x = (this.gameMap.width * 16 - logWidth) / 2;
        const y = (this.gameMap.height * 16 - logHeight) / 2;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x, y, logWidth, logHeight);
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '12px monospace';
        const padding = 10;

        this.log.messages.slice(-Math.floor((logHeight - padding * 2) / 16)).forEach((message, index) => {
            this.ctx.fillText(message, x + padding, y + padding + index * 16);
        });
    }

    findActor(x: number, y: number): Actor | undefined {
        return this.actors.find(actor => actor.x === x && actor.y === y);
    }

    tick(): void {
        this.actors.forEach(actor => actor.tick(this));
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (this.log.isOpen) {
            this.logIsOpen_HandleKeyDown(e);
        } else {
            this.gameplay_HandleKeyDown(e);
        }
    };

    private gameplay_HandleKeyDown(e: KeyboardEvent): void {
        let shouldTick = false;
        let shouldRender = false;
        let shouldPreventDefault = true;

        let dx = 0;
        let dy = 0;
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                dy = -1;
                shouldTick = true;
                this.log.add("You moved up.");
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                dy = 1;
                shouldTick = true;
                this.log.add("You moved down.");
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                dx = -1;
                shouldTick = true;
                this.log.add("You moved left.");
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                dx = 1;
                shouldTick = true;
                this.log.add("You moved right.");
                break;
            case 'Tab':
                this.log.show();
                shouldRender = true;
                break;
            default:
                shouldPreventDefault = false;
                break;
        }

        if (shouldPreventDefault) {
            e.preventDefault();
        }

        if (shouldTick) {
            this.statusText = '';
            this.movePlayer(dx, dy);
            this.tick();
        }

        if (shouldTick || shouldRender) {
            this.render();
        }
    }

    private logIsOpen_HandleKeyDown(e: KeyboardEvent): void {
        let shouldRender = false;
        let shouldPreventDefault = true;

        switch (e.key) {
            case 'Tab':
                this.log.hide();
                shouldRender = true;
                break;
            case 'Escape':
                this.log.hide();
                shouldRender = true;
                break;
            default:
                shouldPreventDefault = false;
                break;
        }

        if (shouldPreventDefault) {
            e.preventDefault();
        }

        if (shouldRender) {
            this.render();
        }
    }

    private movePlayer(dx: number, dy: number): void {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        const target = this.findActor(newX, newY);
        if (target && target !== this.player) {
            this.player.handleCollision(this, target);
        } else if (this.gameMap.isWalkable(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
            this.calculateSeenTiles();
        }
    }

    private calculateSeenTiles(): void {
        this.gameMap.calculateSeenTiles(this.player.x, this.player.y, 30);
    }
}
