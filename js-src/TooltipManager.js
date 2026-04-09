// TooltipManager.js - Hoverable tooltip system
export class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.currentTarget = null;
        this.showTimer = null;
        this.delay = 500; // ms
    }

    show(text, element, options = {}) {
        // Clear any existing timer
        this.clearTimer();

        // Set timer for delayed show
        this.showTimer = setTimeout(() => {
            this.showImmediate(text, element, options);
        }, options.delay || this.delay);
    }

    showImmediate(text, element, options = {}) {
        this.hide();

        this.currentTarget = element;
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'waveform-tooltip';
        this.tooltip.innerHTML = text;

        this.tooltip.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-family: 'Segoe UI', Arial, sans-serif;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8);
            border: 1px solid #444;
            max-width: 250px;
            line-height: 1.4;
        `;

        document.body.appendChild(this.tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;

        // Keep tooltip on screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 8; // Show below if no room above
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;

        // Add fade-in animation
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transition = 'opacity 0.2s';
        setTimeout(() => {
            if (this.tooltip) this.tooltip.style.opacity = '1';
        }, 10);
    }

    hide() {
        this.clearTimer();
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        this.currentTarget = null;
    }

    clearTimer() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }
    }

    // Helper to add tooltip to an element
    attach(element, text, options = {}) {
        element.addEventListener('mouseenter', () => {
            this.show(text, element, options);
        });
        element.addEventListener('mouseleave', () => {
            this.hide();
        });
    }
}

// Tooltip text configuration
export const tooltips = {
    // Basic settings
    width: 'Output image width in pixels',
    height: 'Output image height in pixels',
    size: 'Size of individual dots/bars in pixels. Larger = bolder appearance',
    spacing: 'Distance between dot centers. Smaller = denser waveform',

    // Colors
    dot_color: 'Click to open color picker. Choose from presets or enter custom hex color',
    background_color: 'Background color for the visualization',
    gradient_mode: 'Enable multi-color gradients for more dynamic visuals',

    // Animation
    animation_style: 'Choose animation type:\n• Scrolling: Moving waveform\n• Breathing: Pulsing effect\n• Radial: Circular pattern\n• Bars: Equalizer style\n• Wave: Flowing sine waves\n• Spectrum: FFT frequency analyzer\n• Circular: Rotating circle',

    max_height: 'Maximum waveform amplitude as percentage of image height. Higher = more dramatic',
    fps: 'Frames per second. Higher = smoother but larger file size',
    max_frames: 'Limit total frames to prevent long processing. 0 = unlimited',

    // Opacity
    opacity_mode: 'Dot opacity levels:\n• Uniform: All dots same brightness (fastest)\n• 3_levels: Simple gradation\n• 5_levels: Medium variation\n• 10_levels: Smooth gradients',

    // Advanced
    window_size: 'Time window in seconds (scrolling only). Smaller = more detail',
    amplitude_boost: 'Multiplier for waveform amplitude. Increase if waveform looks too small',
    preview_mode: 'Fast preview with test pattern (no audio processing)'
};
