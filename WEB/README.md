# Runtime Radio Live Machine v1.0

<div align="center">
  <img width="1200" height="475" alt="Runtime Radio Live Machine Banner" src="https://via.placeholder.com/1200x475/1f2937/06b6d4?text=Runtime+Radio+Live+Machine" />
</div>

## 🎵 Professional Audio Console for Radio & Podcast Production

**Runtime Radio Live Machine** is a modern, web-based audio console designed for radio hosts, podcasters, DJs, and live event producers. Combining professional audio processing with an intuitive interface, it provides everything needed for real-time audio management and creative sound design.

## ✨ Key Features

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

### 🎨 **User Experience**
- **Multilingual Interface**: 8 languages with native flag icons
- **Real-time Visual Feedback**: Progress bars and status indicators
- **Undo/Redo System**: Full configuration history
- **Preset Templates**: 5 professional presets + custom configurations
- **Keyboard Shortcuts**: Complete keyboard control

### 💾 **Data Management**
- **Auto-Save**: Automatic configuration persistence
- **Export/Import**: JSON-based configuration sharing
- **IndexedDB Storage**: Reliable audio file management
- **Migration Support**: Backward compatibility with older configs

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- **Modern Web Browser** (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/runtime-radio-live-machine.git
   cd runtime-radio-live-machine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

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
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Audio Engine**: Web Audio API with real-time processing
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Vite for fast development and optimized builds
- **Internationalization**: Custom i18n system with 8 languages

### Project Structure
```
runtime-radio-live-machine/
├── src/
│   ├── components/          # React components
│   │   ├── JingleButton.tsx # Individual audio button
│   │   ├── JingleGrid.tsx   # Button grid layout
│   │   ├── SettingsDialog.tsx # Button configuration
│   │   └── GlobalSettingsDialog.tsx # App-wide settings
│   ├── contexts/            # React contexts
│   │   └── LanguageContext.tsx # Internationalization
│   ├── i18n/               # Translation files
│   │   └── index.ts        # Translation definitions
│   ├── types.ts            # TypeScript type definitions
│   ├── constants.ts        # App constants and presets
│   ├── db.ts               # IndexedDB utilities
│   ├── hooks.ts            # Custom React hooks
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── CHANGELOG.md            # Version history
├── ANTI_REGRESSION_TESTS.md # Test suite
├── MINI_GUIDE.txt          # Quick reference
└── README.md              # This file
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

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and feature updates.

## 🧪 Testing

Run the comprehensive test suite defined in [ANTI_REGRESSION_TESTS.md](ANTI_REGRESSION_TESTS.md) to ensure all features work correctly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Maintain Web Audio API compatibility
- Test across all supported browsers
- Update documentation for new features
- Run anti-regression tests before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Concept**: Simone Pizzi (Runtime Radio)
- **Development**: AI-assisted development with human oversight
- **Community**: Open source contributors and beta testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/runtime-radio-live-machine/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/runtime-radio-live-machine/discussions)
- **Documentation**: See [MINI_GUIDE.txt](MINI_GUIDE.txt) for quick reference

---

**Runtime Radio Live Machine** - Professional audio production in your browser.
