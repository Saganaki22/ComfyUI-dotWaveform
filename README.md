# ComfyUI Dotted Waveform Visualizer 🎵

[![GitHub Stars](https://img.shields.io/github/stars/Saganaki22/ComfyUI-dotWaveform?style=for-the-badge&logo=github)](https://github.com/Saganaki22/ComfyUI-dotWaveform/stargazers)
[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![ComfyUI](https://img.shields.io/badge/ComfyUI-Compatible-brightgreen?style=for-the-badge)](https://github.com/comfyanonymous/ComfyUI)

A ComfyUI node that generates animated dotted waveform visualizations from audio input with multiple animation styles.


![AnimateDiff_00049](https://github.com/user-attachments/assets/4a202cc8-8831-4e6c-8c92-d96064c07384)



## ✨ Features

- **Seven Animation Styles**: Scrolling, breathing, radial, bars, wave, spectrum, and circular
- **Modern Dark UI**: Custom color pickers and gradient editor with dark theme
- **Multi-Color Gradients**: Create stunning gradient effects across any animation style
- **Advanced Amplitude Control**: Fine-tune waveform intensity with 0.5x-5.0x boost
- **FFT Spectrum Analysis**: Real-time frequency domain visualization like music equalizers
- **Interactive Color Picker**: 8 preset palettes (Neon, Pastel, Synthwave, Fire, Ocean, and more)
- **Gradient Editor**: Visual gradient builder with presets (Cyber, Fire, Ocean, Sunset, Matrix, Rainbow)
- **Audio Passthrough**: Compatible with VideoHelperSuite Video Combine
- **HD Output**: Up to 1920x1920 resolution support
- **Variable Opacity**: Uniform, 3-level, 5-level, or 10-level opacity modes
- **Enhanced Max Height**: Up to 150% of image height for taller waveforms
- **Preview Mode**: Fast preview for testing settings without audio processing
- **Helpful Tooltips**: Hover over any parameter for detailed explanations


<img width="1542" height="812" alt="Screenshot 2025-11-06 210103" src="https://github.com/user-attachments/assets/ab770841-4f5c-47f2-a485-bf72d8b73533" />


## 🎨 Advanced Features

<details>
<summary><b>🌈 Gradient System</b> - Multi-color gradients on any animation</summary>

### Multi-Color Gradient Support
Create stunning multi-color gradient effects that work with ALL animation styles:
- **Enable**: Toggle "🌈 Gradient Mode" in the node
- **Edit**: Click "✨ Edit Gradient" to open the visual gradient editor
- **Gradient Stops**: Add up to 10 color stops with custom positions (0.0 to 1.0)
- **Live Preview**: See gradient indicator bar at top of node
- **Works Everywhere**: Scrolling, breathing, radial, bars, wave, spectrum, and circular animations all support gradients

  <img width="474" height="741" alt="Screenshot 2025-11-06 210042" src="https://github.com/user-attachments/assets/42aa17b4-f3aa-4958-8117-02a34086e510" />


### Gradient Presets
6 built-in gradient presets for quick styling:
- **Cyber**: Electric blue to hot pink
- **Fire**: Yellow to deep red
- **Ocean**: Cyan to deep blue
- **Sunset**: Orange to purple
- **Matrix**: Bright to dark green
- **Rainbow**: Full color spectrum

</details>

<details>
<summary><b>🎨 Color Picker</b> - Interactive color selection with palettes</summary>

### Visual Color Picker
Modern color picker interface replaces standard text input:
- Click "🎨 Pick Dot Color" or "🎨 Pick BG Color" to open picker
- **8 Preset Palettes**: Neon, Pastel, Synthwave, Monochrome, Fire, Ocean, Forest, Sunset
- **Dark Theme**: Modern gradient UI with centered modal
- **Quick Selection**: Click any preset color for instant application
- **Hex Display**: Shows hex codes for each color

</details>

<details>
<summary><b>⚙️ Advanced Mode</b> - Amplitude boost control</summary>

### Amplitude Boost
Fine-tune waveform intensity beyond standard max_height:
- **Enable**: Toggle "⚙️ Advanced Mode" in the node
- **Range**: 0.5x to 5.0x multiplier (default: 1.5x when enabled)
- **Effect**: Multiplies the max_height parameter for extra-tall waveforms
- **Default Behavior**: When Advanced Mode is OFF, amplitude_boost = 1.0 (no boost)
- **Use Cases**:
  - Boost subtle audio signals (3.0x-5.0x)
  - Reduce overwhelming waveforms (0.5x-0.9x)
  - Perfect combination with max_height for ultimate control

</details>

<details>
<summary><b>💡 Tooltips</b> - Helpful parameter explanations</summary>

### Interactive Help System
Every parameter includes detailed tooltip explanations:
- **Hover**: Move mouse over any parameter label
- **Instant Help**: Tooltip appears with description and tips
- **Context-Aware**: Explains parameter effects for each animation style
- **Examples Included**: Most tooltips show example values and use cases

</details>

## 📋 Installation

### ComfyUI Manager (Recommended)
1. Open ComfyUI Manager
2. Search for "dotWaveform"
3. Click Install
4. Restart ComfyUI

### Manual Installation
1. Clone to `ComfyUI/custom_nodes/ComfyUI-dotWaveform/`
2. Install dependencies: `pip install -r requirements.txt`
3. Restart ComfyUI

## ⚙️ Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| **width** | 1280 | 100-1920 | Output width in pixels |
| **height** | 720 | 100-1920 | Output height in pixels |
| **size** | 6 | 1-30 | Individual dot/bar size in pixels |
| **spacing** | 3 | 1-40 | Distance between dot/bar centers |
| **dot_color** | #00FFFF | Hex | Color of waveform elements |
| **background_color** | #000000 | Hex | Background color |
| **animation_style** | scrolling | 7 options | Animation type |
| **max_height** | 60 | 5-150 | Maximum waveform size as % of image height |
| **fps** | 10 | 1-60 | Animation frames per second |
| **max_frames** | 300 | 0-1000 | Frame limit (0 = unlimited) |
| **opacity_mode** | uniform | 4 levels | Dot opacity variation |
| **window_size** | 2.0 | 0.1-10.0 | Time window for scrolling (seconds) |
| **preview_mode** | False | Boolean | Fast preview without audio processing |

## 🎨 Animation Styles

**Scrolling**: Waveform scrolls left-to-right following audio timeline with continuous center line

**Breathing**: All dots pulse together with audio amplitude uniformly

**Radial**: Concentric rings expand from center creating ripple effects

**Bars**: Vertical frequency bars with teardrop bell curve shape and 2x enhanced height response

**Wave**: Multiple layered sine wave patterns that morph with audio intensity

**Spectrum**: FFT frequency analysis displaying bass (left) to treble (right) like music equalizers

**Circular**: Dots arranged in a circle with radius that expands and contracts with audio amplitude

## 🎭 Opacity Modes

- **uniform**: All elements same brightness (fastest)
- **3_levels**: 0%, 50%, 100% opacity steps
- **5_levels**: Progressive 0%, 25%, 50%, 75%, 100% opacity
- **10_levels**: Smoothest gradients with 10 opacity levels

## 🔧 Technical Notes

- **Audio Formats**: All ComfyUI compatible audio formats
- **Audio Compatibility**: Automatic mono→stereo conversion for VideoHelperSuite
- **Sample Rates**: Works with 24kHz, and standard rates
- **Output**: RGB image sequences compatible with video nodes

## 📝 Changelog

### Version 2.0.0 (Latest)
- **NEW**: Modern dark-themed custom UI with interactive widgets
- **NEW**: Multi-color gradient system with visual editor and 6 presets
- **NEW**: Interactive color picker with 8 preset palettes (Neon, Pastel, Synthwave, Fire, Ocean, Forest, Sunset, Monochrome)
- **NEW**: Advanced mode with amplitude boost control (0.5x-5.0x multiplier)
- **NEW**: Circular animation style with expanding/contracting dots
- **NEW**: Comprehensive tooltip system on all parameters
- **NEW**: Live gradient preview indicator bar at top of node
- **ENHANCED**: All 7 animation styles now support gradients (scrolling, breathing, radial, bars, wave, spectrum, circular)
- **ENHANCED**: Preview mode now respects gradient and amplitude boost settings
- **ENHANCED**: Hidden data-passing widgets for cleaner UI
- **ENHANCED**: Gradient editor centered in viewport with dark theme
- **FIXED**: Amplitude boost now properly defaults to 1.0 (no boost) when Advanced Mode is OFF
- **FIXED**: Preview mode moved to absolute bottom of parameters
- **REMOVED**: Spiral and particles animations (experimental features removed)

### Version 1.0.6
- **NEW**: Added spectrum animation style with FFT frequency analysis
- **NEW**: Real-time frequency domain visualization (bass/mid/treble separation)
- **NEW**: Hanning window function for cleaner frequency analysis
- **NEW**: Automatic frequency band normalization for consistent visualization
- **ENHANCED**: Spectrum bars mirror top/bottom like other animation styles
- **ENHANCED**: All existing settings (size, spacing, opacity_mode) work with spectrum mode

### Version 1.0.5
- Added wave animation style with multiple layered sine patterns
- Increased max_height range to 150% (was 110%) for taller waveforms
- Fixed all preview modes to correctly display each animation style
- Improved tooltips and parameter organization
- Enhanced wave animation with proper audio responsiveness

### Version 1.0.0 (Initial Release)
- Four animation styles: scrolling, breathing, radial, and bars
- Bars mode with teardrop bell curve shape and 2x enhanced height response
- Audio passthrough compatibility with VideoHelperSuite Video Combine node
- Automatic mono→stereo conversion and float16→float32 for video integration
- Multiple opacity modes: uniform, 3_levels, 5_levels, 10_levels
- HD output support up to 1920x1920 resolution
- Full color customization with hex color support
- Preview mode for fast settings testing
- Sharp-edged teardrop shape using exponential decay mathematics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

