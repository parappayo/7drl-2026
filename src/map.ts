
export interface Tile {
    id: string;
    glyph: string;
    walkable: boolean;
    color?: string;
}

export class GameMap {
    width: number;
    height: number;
    tiles: string[];

    emptyTile: Tile = { id: 'empty', glyph: ' ', walkable: false, color: '#000000' };

    tileMap: Record<string, Tile> = {
        'empty': this.emptyTile,
        'floor': { id: 'floor', glyph: '.', walkable: true, color: '#e4e4e4' },
        'wall': { id: 'wall', glyph: '#', walkable: false, color: '#929292' },
    };

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(width * height).fill('empty');
    }

    inBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getTile(x: number, y?: number): Tile {
        let tileID: string;
        if (y === undefined) {
            tileID = this.tiles[x] || 'empty';
        } else {
            tileID = (this.inBounds(x, y) && this.tiles[y * this.width + x]) || 'empty';
        }
        return this.tileMap[tileID] || this.emptyTile;
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = '#000';

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.getTile(i);
            const tileX = x + (i % this.width) * 16;
            const tileY = y + Math.floor(i / this.width) * 16;

            ctx.fillStyle = tile?.color || '#ffffff';
            ctx.fillRect(tileX, tileY, 16, 16);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile?.glyph || '', tileX + 4, tileY + 12);
        }
    }

    addRoom(x: number, y: number, width: number, height: number) {
        for (let j = y; j < y + height; j++) {
            for (let i = x; i < x + width; i++) {
                if (i === x || i === x + width - 1 || j === y || j === y + height - 1) {
                    this.tiles[j * this.width + i] = 'wall';
                } else {
                    this.tiles[j * this.width + i] = 'floor';
                }
            }
        }
    }

    isWalkable(x: number, y: number): boolean {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        const tile = this.getTile(x, y);
        return tile ? tile.walkable : false;
    }
}
