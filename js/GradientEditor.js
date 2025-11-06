// GradientEditor.js - Gradient color system for waveforms
import { ColorPicker } from './ColorPicker.js';

export class GradientEditor {
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
