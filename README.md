
![AnimateDiff_00019](https://github.com/user-attachments/assets/583a5fdf-add2-48f8-9226-aa2b873e0b3d)

# ComfyUI Dotted Waveform Visualizer 🎵

[![GitHub Stars](https://img.shields.io/github/stars/Saganaki22/ComfyUI-dotWaveform?style=for-the-badge&logo=github)](https://github.com/Saganaki22/ComfyUI-dotWaveform/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Saganaki22/ComfyUI-dotWaveform?style=for-the-badge&logo=github)](https://github.com/Saganaki22/ComfyUI-dotWaveform/issues)
[![GitHub License](https://img.shields.io/github/license/Saganaki22/ComfyUI-dotWaveform?style=for-the-badge)](https://github.com/Saganaki22/ComfyUI-dotWaveform/blob/main/LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![ComfyUI](https://img.shields.io/badge/ComfyUI-Compatible-brightgreen?style=for-the-badge)](https://github.com/comfyanonymous/ComfyUI)

A ComfyUI node that generates animated dotted waveform visualizations from audio input with multiple animation styles.


## ✨ Features

- **Six Animation Styles**: Scrolling, breathing, radial, bars, wave, and spectrum
- **FFT Spectrum Analysis**: Real-time frequency domain visualization like music equalizers
- **Teardrop Bars**: Bell curve shape with sharp edges using exponential decay
- **Audio Passthrough**: Compatible with VideoHelperSuite Video Combine
- **HD Output**: Up to 1920x1920 resolution support
- **Variable Opacity**: Uniform, 3-level, 5-level, or 10-level opacity modes
- **Enhanced Max Height**: Up to 150% of image height for taller waveforms
- **Preview Mode**: Fast preview for testing settings without audio processing


<img width="1050" height="870" alt="image_2025-08-30_20-10-15" src="https://github.com/user-attachments/assets/21fd35c0-063c-4888-ae4f-833431e00b75" />

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
| **animation_style** | scrolling | 6 options | Animation type |
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

### Version 1.0.6 (Latest)
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

**Made with ❤️ for the ComfyUI community**
