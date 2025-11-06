// DotWaveformUI.js - Simplified custom UI that doesn't break existing widgets
import { app } from "../../scripts/app.js";
import { ColorPicker } from './ColorPicker.js';
import { GradientEditor } from './GradientEditor.js';
import { TooltipManager, tooltips } from './TooltipManager.js';

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
            amplitude_boost: 1.5,
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
        const gradientWidget = this.node.addWidget(
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
        const advancedWidget = this.node.addWidget(
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
                    // Restore to default 1.5 if currently 1.0, otherwise keep current value
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
        const pickerBtn = this.node.addWidget(
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

            // Override getExtraMenuOptions to inject custom data into execution payload
            const originalGetInputData = nodeType.prototype.getInputData;
            nodeType.prototype.getInputData = function(slot) {
                const data = originalGetInputData ? originalGetInputData.apply(this, arguments) : null;
                return data;
            };

            // Intercept onExecuted to pass properties via extra_pnginfo
            const originalOnNodeCreated = nodeType.prototype.onNodeCreated;

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
