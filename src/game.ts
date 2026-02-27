import { GameMap } from './map.js';

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

    console.log('Canvas initialized');
    const gameMap = new GameMap(50, 36);
    gameMap.addRoom(5, 5, 10, 8);
    gameMap.addRoom(20, 10, 15, 12);
    gameMap.drawToCanvas(ctx, 0, 0);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
