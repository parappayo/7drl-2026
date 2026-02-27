function init(): void {
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
    
    // Draw a box
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 50, 200, 150);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
