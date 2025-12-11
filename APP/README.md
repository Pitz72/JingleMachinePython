# Runtime Radio Live Machine v1.4.1 (Public Beta)

<div align="center">
  <img width="1200" height="475" alt="Runtime Radio Live Machine Banner" src="https://via.placeholder.com/1200x475/1f2937/06b6d4?text=Runtime+Radio+Live+Machine+v1.4.1" />
</div>

## 🎵 Professional Desktop Workstation for Audio Production

**Runtime Radio Live Machine v1.4.1** is a cutting-edge **Public Beta** desktop application designed for professional audio production. Featuring native Electron integration, MIDI support, dark/light themes, and comprehensive accessibility, it delivers enterprise-grade audio processing with an intuitive, responsive interface for radio hosts, podcasters, DJs, and live event producers.

## ✨ Key Features

### 🖥️ **Desktop First Experience**
- **Native Application**: Fully integrated Electron desktop app
- **System Integration**: Native file system access and dialogs
- **High Performance**: Optimized local resource usage
- **Window Management**: Custom window controls and framing

### 🎹 **MIDI Integration**
- **Hardware Control**: Direct integration with MIDI controllers
- **Note Mapping**: Configurable MIDI note-to-button mapping (36-96)
- **Real-time Control**: Live performance control via external devices
- **Device Detection**: Automatic MIDI device discovery and management
- **Multi-Device Support**: Simultaneous control from multiple controllers

### 🎨 **Theme System**
- **Dark/Light Modes**: Complete theme switching with system preference detection
- **Persistent Settings**: Theme choices saved across sessions
- **High Contrast**: Optimized for accessibility and visibility
- **Theme Consistency**: All components adapt seamlessly to theme changes

### 📱 **Adaptive Design**
- **Responsive Grid**: Adaptive button layout (6→11 columns based on screen)
- **Touch Optimization**: 44px minimum touch targets
- **Gesture Support**: Touch and swipe interactions optimized

### ♿ **Accessibility Excellence**
- **WCAG Compliance**: Full accessibility standards compliance
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Keyboard Navigation**: Complete keyboard accessibility
- **Focus Management**: Logical focus flow and visual indicators

### 🎛️ **Advanced Audio Engine**
- **88-Button Grid (8x11)**: Expandable professional layout
- **Web Audio API**: Real-time audio processing with 128 simultaneous channels
- **3-Band Equalizer**: ±20dB control over Low/Mid/High frequencies
- **Stereo Processing**: Full panning and crossfader controls

### 🎚️ **Professional Mixer**
- **Solo/Mute Controls**: Individual channel isolation
- **Cue/Preview Mode**: -10dB monitoring for pre-listening
- **Fade Controls**: Configurable fade-in/out (100-5000ms)
- **Master Volume**: Global volume control

### 🎼 **Playback Modes**
- **Restart**: Standard playback from beginning
- **Continue**: Resume/pause functionality
- **Overlay**: Simultaneous playback for sound effects
- **Queue**: Sequential playback management
- **Loop**: Continuous repetition

### 🎨 **Enhanced User Experience**
- **Multilingual Interface**: 8 languages with native flag icons
- **Real-time Visual Feedback**: Progress bars and status indicators
- **Undo/Redo System**: Full configuration history
- **Preset Templates**: 9 professional presets + custom configurations
- **Keyboard Shortcuts**: Complete keyboard control
- **Error Boundaries**: Graceful error handling and recovery

### 💾 **Advanced Data Management**
- **Auto-Save**: Automatic configuration persistence
- **Export/Import**: JSON-based configuration sharing
- **IndexedDB Storage**: Reliable audio file management
- **Migration Support**: Backward compatibility with older configs
- **Cloud Sync**: Configuration synchronization capabilities

## 🚀 Quick Start

### Prerequisites
- **Windows/Mac/Linux**
- **No external dependencies** (Standalone Application)

### Installation

1. **Download the Installer** regarding version v1.4.1
2. **Run the Installer**
3. **Launch the Application**

### First Use
1. **Select Language**: Choose your preferred language from the flag icons
2. **Welcome Screen**: Read the introduction and click "START"
3. **Load Audio**: Right-click buttons to open settings and load audio files
4. **Start Creating**: Configure playback modes, effects, and start your production

## 📖 Usage Guide

### Basic Operation
- **Left Click**: Play/pause audio on configured buttons
- **Right Click**: Open button settings dialog
- **Drag & Drop**: Load audio files directly onto buttons

### Keyboard Shortcuts
- **1-6, Q-Y, A-H, Z-N**: Trigger buttons 1-24
- **Shift + Key**: Open settings for corresponding button
- **ESC**: Stop all audio or close dialogs
- **Ctrl+Z/Y**: Undo/Redo actions
- **Ctrl+S/O**: Save/Load configuration
- **Arrow Keys**: Adjust master volume

### Advanced Features
- **Equalizer**: Fine-tune frequency response per button
- **Mixer**: Control panning, solo/mute, and cue monitoring
- **Presets**: Load professional templates or save custom setups
- **Global Settings**: Access crossfader and playlist mode

## 🏗️ Architecture

### Technology Stack
- **Core**: Electron + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Audio Engine**: Web Audio API with real-time processing + MIDI API
- **State Management**: React hooks with localStorage + IndexedDB persistence
- **Theme System**: CSS custom properties with React Context
- **Build Tool**: Vite with code splitting and optimization
- **Internationalization**: Custom i18n system with 8 languages
- **Accessibility**: WCAG 2.1 AA compliant with ARIA support

### Project Structure
```
runtime-radio-live-machine/
├── electron/           # Electron main process
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── i18n/           # Translation files
│   ├── services/       # Core services (MIDI, Audio)
│   ├── types.ts        # TypeScript definitions
│   ├── constants.ts    # App constants
│   ├── db.ts           # Storage layer
│   └── App.tsx         # Main UI
├── assets/             # Icons and media
├── package.json        # Dependencies
└── README.md           # This file
```

## 🎯 Use Cases

### Radio Broadcasting
- Live show audio console with instant access to jingles and effects
- Professional mixing with real-time EQ and dynamics
- Queue management for automated playback sequences

### Podcast Production
- Multi-track audio management with precise timing
- Voice enhancement with built-in equalization
- Sound effect library with overlay capabilities

### Live Events
- DJ mixing with crossfader and cue monitoring
- Event audio control with fade transitions
- Emergency broadcast capabilities

### Music Production
- Creative sound design with layered audio
- Real-time effects processing
- Performance instrument with keyboard control

## 🔧 Configuration

### Audio Settings
- **Sample Rate**: Automatic detection (Web Audio API default)
- **Bit Depth**: Browser-dependent (typically 32-bit float)
- **Channels**: Stereo processing with mono compatibility

### Performance
- **Memory**: Optimized for 88 simultaneous audio sources
- **CPU**: Efficient real-time processing with Web Audio API
- **Storage**: IndexedDB for persistent audio file caching

## 📋 Changelog

**v1.4.1 (Public Beta)**
- Initial Public Beta Release
- Full Desktop Migration
- Performance Improvements

See [CHANGELOG.md](../../documentazione/changelog/CHANGELOG.md) for detailed version history.

## 🧪 Testing

This is a **Public Beta** release. Please report any issues on the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Concept**: Simone Pizzi (Runtime Radio)
- **Development**: AI-assisted development with human oversight
- **Community**: Open source contributors and beta testers

---

**Runtime Radio Live Machine v1.4.1** - Professional Desktop Audio Workstation.

