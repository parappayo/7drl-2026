import { Game } from './game.js';

export function init(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    const game = new Game(ctx);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
