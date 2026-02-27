import { Actor } from "./actor";

export class Player implements Actor {
    type: string = 'player';
    x: number = 0;
    y: number = 0;
    glyph: string = '@';
    color: string = '#0000ff';

    tick(): void {
        // TODO: resolve time-based effects like hunger, healing
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillText(this.glyph, this.x * 16 + 4, this.y * 16 + 12);
    }
}
