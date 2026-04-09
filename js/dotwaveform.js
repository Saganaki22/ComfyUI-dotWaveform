import { app } from '../../scripts/app.js';

// ColorPicker.js - Modern color picker component with presets
class ColorPicker {
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

// GradientEditor.js - Gradient color system for waveforms

class GradientEditor {
    constructor() {
        this.overlay = null;
        this.container = null;
        this.callback = null;
        this.colorPicker = new ColorPicker();
        this.gradientStops = [
            { color: '#00FFFF', position: 0 },
            { color: '#FF00FF', position: 1 }
        ];

        // Gradient presets
        this.presets = {
            'Cyber': [
                { color: '#00FFFF', position: 0 },
                { color: '#FF00FF', position: 1 }
            ],
            'Fire': [
                { color: '#FF0000', position: 0 },
                { color: '#FF8800', position: 0.5 },
                { color: '#FFFF00', position: 1 }
            ],
            'Ocean': [
                { color: '#000080', position: 0 },
                { color: '#0080FF', position: 0.5 },
                { color: '#00FFFF', position: 1 }
            ],
            'Sunset': [
                { color: '#FF1744', position: 0 },
                { color: '#F50057', position: 0.33 },
                { color: '#D500F9', position: 0.66 },
                { color: '#651FFF', position: 1 }
            ],
            'Matrix': [
                { color: '#003300', position: 0 },
                { color: '#00FF00', position: 1 }
            ],
            'Rainbow': [
                { color: '#FF0000', position: 0 },
                { color: '#FF7F00', position: 0.17 },
                { color: '#FFFF00', position: 0.33 },
                { color: '#00FF00', position: 0.5 },
                { color: '#0000FF', position: 0.67 },
                { color: '#4B0082', position: 0.83 },
                { color: '#9400D3', position: 1 }
            ]
        };
    }

    show(options = {}) {
        if (this.container) {
            this.hide();
        }

        this.callback = options.callback;
        if (options.gradientStops) {
            this.gradientStops = JSON.parse(JSON.stringify(options.gradientStops));
        }

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 9998; backdrop-filter: blur(3px);
        `;
        this.overlay.addEventListener('mousedown', () => this.hide());
        document.body.appendChild(this.overlay);

        // Create container
        this.container = document.createElement('div');
        this.container.className = 'gradient-editor-container';
        this.container.addEventListener('mousedown', (e) => e.stopPropagation());
        this.container.style.cssText = `
            position: fixed;
            background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #444;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.9);
            z-index: 9999;
            font-family: 'Segoe UI', Arial, sans-serif;
            width: 400px;
            padding: 20px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Position container - ALWAYS CENTER IT
        // Calculate center position (container width is 400px + 40px padding = 440px total)
        const containerWidth = 440;
        const containerHeight = 600; // Approximate height
        const x = (window.innerWidth - containerWidth) / 2;
        const y = (window.innerHeight - containerHeight) / 2;

        this.container.style.left = `${Math.max(10, x)}px`;
        this.container.style.top = `${Math.max(10, y)}px`;

        this.buildUI();
        document.body.appendChild(this.container);
    }

    buildUI() {
        // Title
        const title = document.createElement('div');
        title.innerHTML = '🌈 Gradient Editor';
        title.style.cssText = `
            color: #fff; font-size: 18px; font-weight: 600;
            margin-bottom: 20px; text-align: center;
        `;
        this.container.appendChild(title);

        // Gradient preview
        this.buildGradientPreview();

        // Color stops list
        this.buildColorStopsList();

        // Presets
        this.buildPresets();

        // Action buttons
        this.buildActionButtons();
    }

    buildGradientPreview() {
        const previewContainer = document.createElement('div');
        previewContainer.style.cssText = `margin-bottom: 20px;`;

        const previewLabel = document.createElement('div');
        previewLabel.textContent = 'Preview';
        previewLabel.style.cssText = `
            color: #aaa; font-size: 12px; font-weight: 600; margin-bottom: 8px;
        `;
        previewContainer.appendChild(previewLabel);

        const preview = document.createElement('div');
        preview.style.cssText = `
            height: 60px; border-radius: 8px;
            border: 2px solid #555;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
        `;
        this.gradientPreview = preview;
        this.updateGradientPreview();
        previewContainer.appendChild(preview);

        this.container.appendChild(previewContainer);
    }

    buildColorStopsList() {
        const stopsContainer = document.createElement('div');
        stopsContainer.style.cssText = `margin-bottom: 20px;`;

        const stopsLabel = document.createElement('div');
        stopsLabel.textContent = 'Color Stops';
        stopsLabel.style.cssText = `
            color: #aaa; font-size: 12px; font-weight: 600; margin-bottom: 8px;
        `;
        stopsContainer.appendChild(stopsLabel);

        const stopsList = document.createElement('div');
        stopsList.style.cssText = `
            display: flex; flex-direction: column; gap: 8px;
        `;
        this.stopsList = stopsList;

        this.renderColorStops();
        stopsContainer.appendChild(stopsList);

        // Add stop button
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Color Stop';
        addBtn.style.cssText = `
            width: 100%; padding: 8px; margin-top: 8px;
            background: #2a2a2a; border: 1px solid #555;
            border-radius: 6px; color: #fff; cursor: pointer;
            transition: all 0.2s;
        `;
        addBtn.onmouseover = () => {
            addBtn.style.background = '#3a3a3a';
            addBtn.style.borderColor = '#777';
        };
        addBtn.onmouseout = () => {
            addBtn.style.background = '#2a2a2a';
            addBtn.style.borderColor = '#555';
        };
        addBtn.onclick = () => {
            this.gradientStops.push({ color: '#FFFFFF', position: 0.5 });
            this.gradientStops.sort((a, b) => a.position - b.position);
            this.renderColorStops();
            this.updateGradientPreview();
        };
        stopsContainer.appendChild(addBtn);

        this.container.appendChild(stopsContainer);
    }

    renderColorStops() {
        this.stopsList.innerHTML = '';
        this.gradientStops.forEach((stop, index) => {
            const stopItem = document.createElement('div');
            stopItem.style.cssText = `
                display: flex; gap: 8px; align-items: center;
                background: #222; padding: 8px; border-radius: 6px;
                border: 1px solid #444;
            `;

            // Color swatch
            const swatch = document.createElement('div');
            swatch.style.cssText = `
                width: 40px; height: 40px; border-radius: 6px;
                background: ${stop.color}; border: 2px solid #555;
                cursor: pointer; flex-shrink: 0;
                transition: transform 0.2s;
            `;
            swatch.onmouseover = () => swatch.style.transform = 'scale(1.1)';
            swatch.onmouseout = () => swatch.style.transform = 'scale(1)';
            swatch.onclick = (e) => {
                this.colorPicker.show({
                    event: e,
                    initialColor: stop.color,
                    callback: (color) => {
                        stop.color = color;
                        swatch.style.background = color;
                        this.updateGradientPreview();
                    }
                });
            };
            stopItem.appendChild(swatch);

            // Position slider
            const sliderContainer = document.createElement('div');
            sliderContainer.style.cssText = `flex: 1;`;

            const posLabel = document.createElement('div');
            posLabel.textContent = `Position: ${Math.round(stop.position * 100)}%`;
            posLabel.style.cssText = `
                color: #999; font-size: 11px; margin-bottom: 4px;
            `;
            sliderContainer.appendChild(posLabel);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = stop.position * 100;
            slider.style.cssText = `
                width: 100%; height: 6px; border-radius: 3px;
                background: #444; cursor: pointer;
            `;
            slider.oninput = (e) => {
                stop.position = e.target.value / 100;
                posLabel.textContent = `Position: ${e.target.value}%`;
                this.gradientStops.sort((a, b) => a.position - b.position);
                this.updateGradientPreview();
            };
            sliderContainer.appendChild(slider);
            stopItem.appendChild(sliderContainer);

            // Delete button
            if (this.gradientStops.length > 2) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '×';
                deleteBtn.style.cssText = `
                    width: 30px; height: 30px; border-radius: 6px;
                    background: #ff4444; border: none;
                    color: #fff; font-size: 20px; cursor: pointer;
                    transition: background 0.2s;
                `;
                deleteBtn.onmouseover = () => deleteBtn.style.background = '#ff6666';
                deleteBtn.onmouseout = () => deleteBtn.style.background = '#ff4444';
                deleteBtn.onclick = () => {
                    this.gradientStops.splice(index, 1);
                    this.renderColorStops();
                    this.updateGradientPreview();
                };
                stopItem.appendChild(deleteBtn);
            }

            this.stopsList.appendChild(stopItem);
        });
    }

    buildPresets() {
        const presetsContainer = document.createElement('div');
        presetsContainer.style.cssText = `margin-bottom: 20px;`;

        const presetsLabel = document.createElement('div');
        presetsLabel.textContent = 'Presets';
        presetsLabel.style.cssText = `
            color: #aaa; font-size: 12px; font-weight: 600; margin-bottom: 8px;
        `;
        presetsContainer.appendChild(presetsLabel);

        const presetsGrid = document.createElement('div');
        presetsGrid.style.cssText = `
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
        `;

        Object.entries(this.presets).forEach(([name, stops]) => {
            const presetBtn = document.createElement('div');
            presetBtn.style.cssText = `
                padding: 12px; border-radius: 8px; cursor: pointer;
                border: 2px solid #444; transition: all 0.2s;
                background: ${this.createGradientString(stops)};
                position: relative; overflow: hidden;
            `;

            const overlay = document.createElement('div');
            overlay.textContent = name;
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5); display: flex;
                align-items: center; justify-content: center;
                color: #fff; font-weight: 600; font-size: 13px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            `;
            presetBtn.appendChild(overlay);

            presetBtn.onmouseover = () => {
                presetBtn.style.borderColor = '#888';
                presetBtn.style.transform = 'scale(1.05)';
            };
            presetBtn.onmouseout = () => {
                presetBtn.style.borderColor = '#444';
                presetBtn.style.transform = 'scale(1)';
            };
            presetBtn.onclick = () => {
                this.gradientStops = JSON.parse(JSON.stringify(stops));
                this.renderColorStops();
                this.updateGradientPreview();
            };

            presetsGrid.appendChild(presetBtn);
        });

        presetsContainer.appendChild(presetsGrid);
        this.container.appendChild(presetsContainer);
    }

    buildActionButtons() {
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex; gap: 10px; margin-top: 20px;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            flex: 1; padding: 12px; background: #2a2a2a;
            border: 1px solid #555; border-radius: 6px;
            color: #fff; cursor: pointer; font-weight: 600;
            transition: all 0.2s;
        `;
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#3a3a3a';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#2a2a2a';
        cancelBtn.onclick = () => this.hide();

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply Gradient';
        applyBtn.style.cssText = `
            flex: 2; padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none; border-radius: 6px;
            color: #fff; cursor: pointer; font-weight: 600;
            transition: transform 0.2s;
        `;
        applyBtn.onmouseover = () => applyBtn.style.transform = 'scale(1.05)';
        applyBtn.onmouseout = () => applyBtn.style.transform = 'scale(1)';
        applyBtn.onclick = () => {
            if (this.callback) {
                this.callback(this.gradientStops);
            }
            this.hide();
        };

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(applyBtn);
        this.container.appendChild(btnContainer);
    }

    createGradientString(stops) {
        const sortedStops = [...stops].sort((a, b) => a.position - b.position);
        const gradientStops = sortedStops.map(s =>
            `${s.color} ${Math.round(s.position * 100)}%`
        ).join(', ');
        return `linear-gradient(90deg, ${gradientStops})`;
    }

    updateGradientPreview() {
        if (this.gradientPreview) {
            this.gradientPreview.style.background = this.createGradientString(this.gradientStops);
        }
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

// TooltipManager.js - Hoverable tooltip system
class TooltipManager {
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

// DotWaveformUI.js - Simplified custom UI that doesn't break existing widgets

class DotWaveformUI {
    constructor(node) {
        this.node = node;
        this.colorPicker = new ColorPicker();
        this.gradientEditor = new GradientEditor();
        this.tooltipManager = new TooltipManager();

        // Initialize properties
        this.node.properties = this.node.properties || {};
        this.initializeProperties();

        // Add new widgets only - don't modify existing ones
        this.addNewWidgets();
    }

    initializeProperties() {
        const defaults = {
            gradient_enabled: false,
            gradient_stops: [
                { color: '#00FFFF', position: 0 },
                { color: '#FF00FF', position: 1 }
            ],
            amplitude_boost: 1.0,
            advanced_mode: false
        };

        Object.entries(defaults).forEach(([key, value]) => {
            if (this.node.properties[key] === undefined) {
                this.node.properties[key] = value;
            }
        });
    }

    findWidget(name) {
        return this.node.widgets?.find(w => w.name === name);
    }

    addNewWidgets() {
        // HIDE the original color input widgets visually (but still send them!)
        const dotColorWidget = this.findWidget('dot_color');
        const bgColorWidget = this.findWidget('background_color');

        if (dotColorWidget) {
            dotColorWidget.computeSize = () => [0, -4];  // Make it take no space (but still send value!)
        }
        if (bgColorWidget) {
            bgColorWidget.computeSize = () => [0, -4];  // Make it take no space (but still send value!)
        }

        // Add color picker buttons to REPLACE the visually hidden inputs
        this.addColorPickerButtons();

        // HIDE the data-passing widgets by making them size 0
        const gradientEnabledWidget = this.findWidget('gradient_enabled');
        const gradientStopsWidget = this.findWidget('gradient_stops');
        const amplitudeBoostWidget = this.findWidget('amplitude_boost');
        const advancedModeWidget = this.findWidget('advanced_mode');

        if (gradientEnabledWidget) {
            gradientEnabledWidget.computeSize = () => [0, -4];
            gradientEnabledWidget.value = this.node.properties.gradient_enabled;
        }
        if (gradientStopsWidget) {
            gradientStopsWidget.computeSize = () => [0, -4];
            gradientStopsWidget.value = JSON.stringify(this.node.properties.gradient_stops);
        }
        if (amplitudeBoostWidget) {
            amplitudeBoostWidget.computeSize = () => [0, -4];
            amplitudeBoostWidget.value = this.node.properties.amplitude_boost || 1.0;
        }
        if (advancedModeWidget) {
            advancedModeWidget.computeSize = () => [0, -4];
            advancedModeWidget.value = this.node.properties.advanced_mode || false;
        }

        // Add gradient toggle
        const self = this;
        this.node.addWidget(
            "toggle",
            "🌈 Gradient Mode",
            this.node.properties.gradient_enabled,
            (value) => {
                self.node.properties.gradient_enabled = value;
                // Update the hidden widget
                const hiddenWidget = self.findWidget('gradient_enabled');
                if (hiddenWidget) hiddenWidget.value = value;

                const gradientBtn = self.findWidget('✨ Edit Gradient');
                if (gradientBtn) {
                    gradientBtn.hidden = !value;
                }
                console.log('Gradient mode:', value);
                self.node.setDirtyCanvas(true, true);
            },
            { serialize: true }
        );

        // Add gradient editor button
        const gradientEditorWidget = this.node.addWidget(
            "button",
            "✨ Edit Gradient",
            null,
            () => {
                // Center in viewport
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                self.gradientEditor.show({
                    event: { clientX: centerX, clientY: centerY },
                    gradientStops: self.node.properties.gradient_stops,
                    callback: (stops) => {
                        self.node.properties.gradient_stops = stops;
                        // Update the hidden widget
                        const hiddenWidget = self.findWidget('gradient_stops');
                        if (hiddenWidget) hiddenWidget.value = JSON.stringify(stops);

                        console.log('Gradient stops updated:', stops);
                        self.node.setDirtyCanvas(true, true);
                    }
                });
            }
        );
        gradientEditorWidget.hidden = !this.node.properties.gradient_enabled;

        // Add advanced mode toggle
        this.node.addWidget(
            "toggle",
            "⚙️ Advanced Mode",
            this.node.properties.advanced_mode,
            (value) => {
                self.node.properties.advanced_mode = value;

                // Update the hidden widget
                const hiddenAdvancedWidget = self.findWidget('advanced_mode');
                if (hiddenAdvancedWidget) hiddenAdvancedWidget.value = value;

                const boostWidget = self.findWidget('🔊 Amplitude Boost');
                const hiddenBoostWidget = self.findWidget('amplitude_boost');

                if (boostWidget) {
                    boostWidget.hidden = !value;
                }

                // When turning OFF advanced mode, reset amplitude to 1.0 (no boost)
                // When turning ON, restore to previous value or default to 1.5
                if (!value) {
                    self.node.properties.amplitude_boost = 1.0;
                    if (hiddenBoostWidget) hiddenBoostWidget.value = 1.0;
                    if (boostWidget) boostWidget.value = 1.0;
                    console.log('Advanced mode OFF: amplitude_boost reset to 1.0');
                } else {
                    // Restore to default 1.0 if currently at no-boost value
                    if (self.node.properties.amplitude_boost === 1.0) {
                        self.node.properties.amplitude_boost = 1.5;
                        if (hiddenBoostWidget) hiddenBoostWidget.value = 1.5;
                        if (boostWidget) boostWidget.value = 1.5;
                    }
                    console.log('Advanced mode ON: amplitude_boost =', self.node.properties.amplitude_boost);
                }

                self.node.setDirtyCanvas(true, true);
            },
            { serialize: true }
        );

        // Add amplitude boost (hidden by default) - FIX: use proper widget initialization
        const boostWidget = this.node.addWidget(
            "number",
            "🔊 Amplitude Boost",
            this.node.properties.amplitude_boost || 1.0,  // Default to 1.0 (no boost)
            (value) => {
                self.node.properties.amplitude_boost = value;
                // Update the hidden widget
                const hiddenWidget = self.findWidget('amplitude_boost');
                if (hiddenWidget) hiddenWidget.value = value;

                console.log('Amplitude boost set to:', value);
            },
            {
                min: 0.5,
                max: 5.0,
                step: 0.1,
                precision: 1,
                serialize: true
            }
        );
        boostWidget.hidden = !this.node.properties.advanced_mode;

        // Hide window_size when animation_style is not "scrolling"
        const animationStyleWidget = this.findWidget('animation_style');
        const windowSizeWidget = this.findWidget('window_size');
        if (animationStyleWidget && windowSizeWidget) {
            const updateWindowSizeVisibility = () => {
                windowSizeWidget.hidden = animationStyleWidget.value !== 'scrolling';
                self.node.setDirtyCanvas(true, true);
            };
            // Set initial state
            updateWindowSizeVisibility();
            // Override the widget callback to also update visibility
            const origCallback = animationStyleWidget.callback;
            animationStyleWidget.callback = function(value) {
                if (origCallback) origCallback.call(this, value);
                updateWindowSizeVisibility();
            };
        }

        // Apply dark theme styling
        this.styleNode();
    }

    styleNode() {
        // Add dark theme to the node
        this.node.color = "#1a1a2e";
        this.node.bgcolor = "#0f0f1e";

        // Add custom foreground drawing for gradient indicator
        const originalOnDrawForeground = this.node.onDrawForeground;
        const self = this;

        this.node.onDrawForeground = function(ctx) {
            if (originalOnDrawForeground) {
                originalOnDrawForeground.apply(this, arguments);
            }

            // Draw gradient mode indicator bar
            if (self.node.properties.gradient_enabled) {
                const stops = self.node.properties.gradient_stops;
                if (stops && stops.length > 0) {
                    const headerHeight = LiteGraph.NODE_TITLE_HEIGHT;
                    const indicatorHeight = 4;

                    // Create gradient
                    const gradient = ctx.createLinearGradient(0, headerHeight - indicatorHeight, this.size[0], headerHeight - indicatorHeight);
                    stops.forEach(stop => {
                        gradient.addColorStop(stop.position, stop.color);
                    });

                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, headerHeight - indicatorHeight, this.size[0], indicatorHeight);
                }
            }

            // Draw advanced mode indicator (left edge bar)
            if (self.node.properties.advanced_mode) {
                ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
                ctx.fillRect(0, 0, 6, this.size[1]);
            }
        };
    }

    addColorPickerButtons() {
        const dotColorWidget = this.findWidget('dot_color');
        const bgColorWidget = this.findWidget('background_color');

        if (dotColorWidget) {
            this.addColorPickerButton(dotColorWidget, '🎨 Pick Dot Color');
        }
        if (bgColorWidget) {
            this.addColorPickerButton(bgColorWidget, '🎨 Pick BG Color');
        }
    }

    addColorPickerButton(colorWidget, label) {
        const self = this;
        this.node.addWidget(
            "button",
            label,
            null,
            () => {
                // Center the color picker in viewport
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                self.colorPicker.show({
                    event: { clientX: centerX, clientY: centerY },
                    initialColor: colorWidget.value,
                    callback: (color) => {
                        colorWidget.value = color;
                        if (colorWidget.callback) {
                            colorWidget.callback(color);
                        }
                        console.log(`Color updated to: ${color}`);
                        self.node.setDirtyCanvas(true, true);
                    }
                });
            }
        );
    }
}

// Register extension with ComfyUI
app.registerExtension({
    name: "dotWaveform.CustomUI",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "DottedWaveformVisualizer") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function() {
                const result = onNodeCreated?.apply(this, arguments);

                // Attach custom UI
                this.dotWaveformUI = new DotWaveformUI(this);

                return result;
            };

            // Add properties to the workflow data
            nodeType.prototype.onConnectionsChange = function(type, slotIndex, isConnected, link, ioSlot) {
                // Store properties
                this.properties.gradient_enabled = this.properties.gradient_enabled ?? false;
                this.properties.gradient_stops = this.properties.gradient_stops ?? [];
                this.properties.amplitude_boost = this.properties.amplitude_boost ?? 1.0;
            };

            // Override serialize to include custom properties
            const onSerialize = nodeType.prototype.onSerialize;
            nodeType.prototype.onSerialize = function(o) {
                if (onSerialize) {
                    onSerialize.apply(this, arguments);
                }
                o.properties = o.properties || {};
                o.properties.gradient_enabled = this.properties.gradient_enabled;
                o.properties.gradient_stops = this.properties.gradient_stops;
                o.properties.amplitude_boost = this.properties.amplitude_boost;
                o.properties.advanced_mode = this.properties.advanced_mode;
            };

            // Override configure to restore custom properties
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function(o) {
                if (onConfigure) {
                    onConfigure.apply(this, arguments);
                }
                if (o.properties) {
                    this.properties.gradient_enabled = o.properties.gradient_enabled ?? false;
                    this.properties.gradient_stops = o.properties.gradient_stops ?? [
                        { color: '#00FFFF', position: 0 },
                        { color: '#FF00FF', position: 1 }
                    ];
                    this.properties.amplitude_boost = o.properties.amplitude_boost ?? 1.0;
                    this.properties.advanced_mode = o.properties.advanced_mode ?? false;
                }
            };
        }
    }
});

console.log("🎵 dotWaveform Custom UI loaded successfully!");
