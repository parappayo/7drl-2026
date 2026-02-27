
export interface Tile {
    id: string;
    glyph: string;
    walkable: boolean;
    color?: string;
}

export class ViewVolume {
    left: number;
    top: number;
    right: number;
    bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}

export class GameMap {
    width: number;
    height: number;
    tiles: string[];
    seen: boolean[];
    viewVolumes: ViewVolume[] = [];

    emptyTile: Tile = { id: 'empty', glyph: ' ', walkable: false, color: '#000000' };

    tileMap: Record<string, Tile> = {
        'empty': this.emptyTile,
        'floor': { id: 'floor', glyph: '.', walkable: true, color: '#e4e4e4' },
        'wall': { id: 'wall', glyph: '#', walkable: false, color: '#929292' },
        'door': { id: 'door', glyph: '+', walkable: true, color: '#e4e4e4' },
        'corridor': { id: 'corridor', glyph: '.', walkable: true, color: '#e4e4e4' },
    };

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(width * height).fill('empty');
        this.seen = new Array(width * height).fill(false);
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

    setIfEmpty(x: number, y: number, tileID: string): void {
        if (this.inBounds(x, y) && this.tiles[y * this.width + x] === 'empty') {
            this.tiles[y * this.width + x] = tileID;
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, this.width * 16, this.height * 16);

        for (let i = 0; i < this.tiles.length; i++) {
            if (!this.seen[i]) {
                continue;
            }
            const tile = this.getTile(i);
            const tileX = x + (i % this.width) * 16;
            const tileY = y + Math.floor(i / this.width) * 16;

            ctx.fillStyle = tile?.color || '#ffffff';
            ctx.fillRect(tileX, tileY, 16, 16);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile?.glyph || '', tileX + 4, tileY + 12);
        }
    }

    findViewVolume(x: number, y: number): ViewVolume[] {
        const volumes: ViewVolume[] = [];
        for (const vol of this.viewVolumes) {
            if (x >= vol.left && x <= vol.right && y >= vol.top && y <= vol.bottom) {
                volumes.push(vol);
            }
        }
        return volumes;
    }

    hasLineOfSight(x1: number, y1: number, x2: number, y2: number): boolean {
        // https://www.roguebasin.com/index.php/Extremely_fast_simplified_LOS
        const vol1 = this.findViewVolume(x1, y1);
        const vol2 = this.findViewVolume(x2, y2);
        for (const v1 of vol1) {
            if (vol2.some(v2 => v1 === v2)) {
                return true;
            }
        }
        return false;
    }

    calculateSeenTiles(playerX: number, playerY: number, radius: number): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const i = y * this.width + x;
                if (this.seen[i] || this.tiles[i] === 'empty') {
                    continue;
                }
                const dx = playerX - x;
                const dy = playerY - y;
                const distance = dx * dx + dy * dy;
                if (distance <= radius * radius) {
                    this.seen[i] = this.hasLineOfSight(playerX, playerY, x, y);
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
        this.viewVolumes.push(new ViewVolume(x, y, x + width - 1, y + height - 1));
    }

    addDoor(x: number, y: number) {
        if (this.inBounds(x, y) && this.tiles[y * this.width + x] === 'wall') {
            this.tiles[y * this.width + x] = 'door';
        }
    }

    addHorizontalCorridor(y: number, x1: number, x2: number) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX; x <= maxX; x++) {
            this.setIfEmpty(x, y - 1, 'wall');
            this.setIfEmpty(x, y, 'corridor');
            this.setIfEmpty(x, y + 1, 'wall');
        }
        this.viewVolumes.push(new ViewVolume(minX, y - 1, maxX, y + 1));
    }

    addVerticalCorridor(x: number, y1: number, y2: number) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY; y <= maxY; y++) {
            this.setIfEmpty(x - 1, y, 'wall');
            this.setIfEmpty(x, y, 'corridor');
            this.setIfEmpty(x + 1, y, 'wall');
        }
        this.viewVolumes.push(new ViewVolume(x - 1, minY, x + 1, maxY));
    }
}
