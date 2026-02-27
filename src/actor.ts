import { Game } from "./game";

export interface Actor {
    type: string;
    x: number;
    y: number;
    glyph: string;
    color: string;

    tick(game: Game): void;
}
