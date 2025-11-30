# Runtime Radio Live Machine v1.1.0

<div align="center">
  <img width="1200" height="475" alt="Runtime Radio Live Machine Banner" src="https://via.placeholder.com/1200x475/1f2937/06b6d4?text=Runtime+Radio+Live+Machine+v1.1.0" />
</div>

## 🎵 Professional Progressive Web App for Audio Production

**Runtime Radio Live Machine v1.1.0** is a cutting-edge, installable web application designed for professional audio production. Featuring PWA capabilities, MIDI integration, dark/light themes, and comprehensive accessibility, it delivers enterprise-grade audio processing with an intuitive, responsive interface for radio hosts, podcasters, DJs, and live event producers.

## ✨ Key Features

### 🌐 **Progressive Web App**
- **Installable Application**: Native app installation on desktop and mobile
- **Offline Functionality**: Full operation without internet connection
- **Service Worker**: Intelligent caching and background sync
- **App Shortcuts**: Quick access to common functions
- **Push Notifications**: Update notifications and status alerts

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

### 📱 **Mobile-First Design**
- **Responsive Grid**: Adaptive button layout (6→11 columns based on screen)
- **Touch Optimization**: 44px minimum touch targets for mobile devices
- **Horizontal Scrolling**: Compact header navigation on small screens
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
- **PWA Framework**: Vite PWA Plugin with Service Worker
- **Audio Engine**: Web Audio API with real-time processing + MIDI API
- **State Management**: React hooks with localStorage + IndexedDB persistence
- **Theme System**: CSS custom properties with React Context
- **Build Tool**: Vite with code splitting and optimization
- **Testing**: Jest + React Testing Library + Playwright
- **Internationalization**: Custom i18n system with 8 languages
- **Accessibility**: WCAG 2.1 AA compliant with ARIA support

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

## 🔒 Security Considerations

### Content Security Policy (CSP)
For production deployment, consider implementing the following CSP headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://esm.sh https://cdn.tailwindcss.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  media-src 'self' blob:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

### CDN Dependencies
The application uses CDN-hosted dependencies for better performance:
- **Tailwind CSS**: Loaded from `cdn.tailwindcss.com`
- **Flag Icons**: Loaded from `cdn.jsdelivr.net`
- **React**: Loaded from `esm.sh` (fallback)

For offline environments, consider bundling these dependencies locally.

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

**Runtime Radio Live Machine v1.1.0** - Enterprise-grade audio production in your browser. Now with PWA capabilities, MIDI integration, and professional accessibility features.
