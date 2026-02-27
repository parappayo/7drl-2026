
export interface Actor {
    type: string;
    x: number;
    y: number;
    glyph: string;
    color: string;

    tick(): void;
}
