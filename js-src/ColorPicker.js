// ColorPicker.js - Modern color picker component with presets
export class ColorPicker {
    constructor() {
        this.overlay = null;
        this.container = null;
        this.callback = null;
        this.currentColor = '#00FFFF';

        // Preset color palettes
        this.presets = {
            'Neon': ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FF0066', '#0066FF'],
            'Pastel': ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4'],
            'Synthwave': ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06FFC4'],
            'Monochrome': ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000'],
            'Fire': ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700'],
            'Ocean': ['#000080', '#0000CD', '#1E90FF', '#00BFFF', '#00CED1', '#40E0D0'],
            'Forest': ['#013220', '#228B22', '#32CD32', '#7FFF00', '#ADFF2F', '#7CFC00'],
            'Sunset': ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE', '#2979FF']
        };
    }

    /**
     * Show color picker
     * @param {Object} options - Configuration
     * @param {Event} options.event - Mouse event for positioning
     * @param {string} options.initialColor - Initial color (hex)
     * @param {Function} options.callback - Callback when color selected
     * @param {string} options.title - Optional title
     */
    show(options = {}) {
        if (this.container) {
            this.hide();
        }

        this.callback = options.callback;
        this.currentColor = options.initialColor || '#00FFFF';

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9998; backdrop-filter: blur(2px);
        `;
        this.overlay.addEventListener('mousedown', () => this.hide());
        document.body.appendChild(this.overlay);

        // Create container
        this.container = document.createElement('div');
        this.container.className = 'color-picker-container';
        this.container.addEventListener('mousedown', (e) => e.stopPropagation());
        this.container.style.cssText = `
            position: fixed;
            background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #444;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.9);
            z-index: 9999;
            font-family: 'Segoe UI', Arial, sans-serif;
            width: 320px;
            padding: 16px;
        `;

        // Position container - ALWAYS CENTER IT
        const containerWidth = 320;
        const containerHeight = 500; // Approximate height with all palettes
        const x = (window.innerWidth - containerWidth) / 2;
        const y = (window.innerHeight - containerHeight) / 2;

        this.container.style.left = `${Math.max(10, x)}px`;
        this.container.style.top = `${Math.max(10, y)}px`;

        // Build UI
        this.buildUI();

        document.body.appendChild(this.container);
    }

    buildUI() {
        // Title
        const title = document.createElement('div');
        title.textContent = '🎨 Color Picker';
        title.style.cssText = `
            color: #fff; font-size: 16px; font-weight: 600;
            margin-bottom: 16px; text-align: center;
        `;
        this.container.appendChild(title);

        // Current color preview
        const previewContainer = document.createElement('div');
        previewContainer.style.cssText = `
            display: flex; gap: 12px; align-items: center; margin-bottom: 16px;
        `;

        const preview = document.createElement('div');
        preview.style.cssText = `
            width: 80px; height: 80px; border-radius: 8px;
            background: ${this.currentColor};
            border: 2px solid #555;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        this.preview = preview;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `flex: 1;`;

        const hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.value = this.currentColor;
        hexInput.style.cssText = `
            width: 100%; padding: 10px; background: #0a0a0a;
            border: 2px solid #444; border-radius: 6px;
            color: #fff; font-family: monospace; font-size: 14px;
            text-align: center; text-transform: uppercase;
        `;
        hexInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                this.currentColor = color;
                this.preview.style.background = color;
            }
        });

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.style.cssText = `
            width: 100%; padding: 10px; margin-top: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none; border-radius: 6px; color: #fff;
            font-weight: 600; cursor: pointer;
            transition: transform 0.2s;
        `;
        applyBtn.onmouseover = () => applyBtn.style.transform = 'scale(1.05)';
        applyBtn.onmouseout = () => applyBtn.style.transform = 'scale(1)';
        applyBtn.onclick = () => {
            if (this.callback) this.callback(this.currentColor);
            this.hide();
        };

        inputContainer.appendChild(hexInput);
        inputContainer.appendChild(applyBtn);
        previewContainer.appendChild(preview);
        previewContainer.appendChild(inputContainer);
        this.container.appendChild(previewContainer);

        // Color presets
        Object.entries(this.presets).forEach(([name, colors]) => {
            const paletteTitle = document.createElement('div');
            paletteTitle.textContent = name;
            paletteTitle.style.cssText = `
                color: #aaa; font-size: 12px; font-weight: 600;
                margin-top: 12px; margin-bottom: 6px;
            `;
            this.container.appendChild(paletteTitle);

            const paletteContainer = document.createElement('div');
            paletteContainer.style.cssText = `
                display: grid; grid-template-columns: repeat(6, 1fr);
                gap: 6px;
            `;

            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.style.cssText = `
                    width: 100%; aspect-ratio: 1;
                    background: ${color};
                    border-radius: 6px;
                    border: 2px solid ${color === this.currentColor ? '#fff' : '#444'};
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                `;
                swatch.onmouseover = () => {
                    if (color !== this.currentColor) {
                        swatch.style.border = '2px solid #888';
                        swatch.style.transform = 'scale(1.1)';
                    }
                };
                swatch.onmouseout = () => {
                    swatch.style.border = color === this.currentColor ? '2px solid #fff' : '2px solid #444';
                    swatch.style.transform = 'scale(1)';
                };
                swatch.onclick = () => {
                    this.currentColor = color;
                    hexInput.value = color;
                    this.preview.style.background = color;
                    // Update all swatch borders
                    paletteContainer.querySelectorAll('div').forEach(s => {
                        s.style.border = '2px solid #444';
                    });
                    swatch.style.border = '2px solid #fff';
                };
                paletteContainer.appendChild(swatch);
            });

            this.container.appendChild(paletteContainer);
        });
    }

    hide() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
