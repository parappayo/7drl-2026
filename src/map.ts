export interface Renderable {
    drawToCanvas(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}

export interface Tile {
    id: string;
    glyph: string;
    walkable: boolean;
    color?: string;
}

export class GameMap implements Renderable {
    width: number;
    height: number;
    tiles: string[];

    tileMap: Record<string, Tile> = {
        'floor': { id: 'floor', glyph: '.', walkable: true, color: '#ccc' },
        'wall': { id: 'wall', glyph: '#', walkable: false, color: '#333' },
    };

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(width * height).fill('floor');
    }

    drawToCanvas(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = '#000';

        for (let i = 0; i < this.tiles.length; i++) {
            const tileID = this.tiles[i] || 'floor';
            const tileX = x + (i % this.width) * 16;
            const tileY = y + Math.floor(i / this.width) * 16;
            const tile = this.tileMap[tileID];

            ctx.fillStyle = tile?.color || '#000';
            ctx.fillRect(tileX, tileY, 16, 16);
        }
    }
}
