# Anti-Regression Tests - Runtime Radio Live Machine v1.1.0

## Purpose

This document outlines critical functionality tests to prevent regressions caused by future modifications, especially those involving Large Language Models (LLMs). Each test ensures core features remain intact and functional for version 1.1.0 with all enhancements.

## Version Information
- **Version Tested**: 1.1.0
- **Release Date**: 2025-09-25
- **Previous Version**: 1.0.0
- **Major Changes**: PWA, Themes, MIDI, Mobile Responsiveness, Accessibility

## Test Categories

### 🔊 **Audio Playback Tests**

#### **Basic Playback**
- [ ] **Button Click Playback**: Click any button with audio → plays immediately
- [ ] **File Loading**: Drag & drop audio file → loads and plays on button click
- [ ] **Volume Control**: Adjust button volume → changes audio level
- [ ] **Master Volume**: Adjust master slider → affects all playing audio

#### **Playback Modes**
- [ ] **Restart Mode**: Click playing button → restarts from beginning
- [ ] **Continue Mode**: Click playing button → pauses, click again → resumes
- [ ] **Overlay Mode**: Multiple overlay buttons play simultaneously
- [ ] **Queue Mode**: Queue buttons play sequentially after current track
- [ ] **Loop Mode**: Loop button repeats continuously

#### **Visual Feedback**
- [ ] **Progress Bar**: Shows playback progress in real-time
- [ ] **Button States**: Playing buttons show cyan ring, paused show amber
- [ ] **Queued Buttons**: Show pulsing animation
- [ ] **Fading Buttons**: Show appropriate visual states

### 🎛️ **Audio Processing Tests**

#### **Equalizer**
- [ ] **Low Band**: Adjust low slider → affects bass frequencies
- [ ] **Mid Band**: Adjust mid slider → affects midrange
- [ ] **High Band**: Adjust high slider → affects treble
- [ ] **Range Limits**: Sliders work within ±20dB range

#### **Mixer Controls**
- [ ] **Pan Control**: Adjust pan → audio moves left/right
- [ ] **Solo**: Enable solo → only solo buttons play
- [ ] **Mute**: Enable mute → button produces no sound
- [ ] **Cue**: Enable cue → audio plays at -10dB

#### **Fade Controls**
- [ ] **Fade In**: Set duration → audio fades in over specified time
- [ ] **Fade Out**: Switch tracks → current fades out over specified time
- [ ] **Crossfade**: Enable crossfade → smooth transitions between tracks

### 🎛️ **Global Controls**

#### **Crossfader**
- [ ] **Stereo Balance**: Adjust crossfader → shifts left/right balance
- [ ] **Center Position**: Center position → balanced stereo
- [ ] **Extreme Positions**: Full left/right → mono output

#### **Preset System**
- [ ] **Load Preset**: Select preset → applies all settings
- [ ] **Template Functionality**: All 5 templates load correctly
- [ ] **Custom Presets**: Save/load custom configurations

### 💾 **Data Persistence**

#### **Configuration**
- [ ] **Auto-Save**: Changes save automatically to localStorage
- [ ] **Manual Save**: Export button creates JSON file
- [ ] **Load Config**: Import JSON → restores all settings
- [ ] **Migration**: Old configs migrate to new format

#### **Audio Files**
- [ ] **IndexedDB Storage**: Files persist across sessions
- [ ] **File Removal**: Remove audio → clears from storage
- [ ] **File Replacement**: Replace file → updates storage

### 🎨 **User Interface Tests**

#### **Settings Dialog**
- [ ] **Button Settings**: Right-click → opens settings dialog
- [ ] **Parameter Changes**: Modify settings → apply immediately
- [ ] **Validation**: Invalid inputs show appropriate errors
- [ ] **Close Dialog**: ESC or close button → closes dialog

#### **Global Settings**
- [ ] **Settings Button**: Click gear icon → opens global dialog
- [ ] **Crossfader Control**: Adjust global crossfader
- [ ] **Playlist Toggle**: Enable/disable playlist mode

#### **Language Support**
- [ ] **Language Selection**: Choose language → UI updates
- [ ] **Flag Display**: Correct flag shows for each language
- [ ] **Text Translation**: All text translates correctly

### ⌨️ **Keyboard Controls**

#### **Playback Shortcuts**
- [ ] **Number Keys**: 1-6, Q-Y, A-H, Z-N trigger buttons
- [ ] **Shift+Number**: Opens settings for corresponding button
- [ ] **ESC**: Stops all audio when no dialog open
- [ ] **ESC in Dialog**: Closes settings dialog

#### **Global Shortcuts**
- [ ] **Ctrl+Z**: Undo last action
- [ ] **Ctrl+Y**: Redo last action
- [ ] **Ctrl+S**: Save configuration
- [ ] **Ctrl+O**: Open load dialog
- [ ] **Arrow Keys**: Adjust master volume

### 🔄 **State Management**

#### **Undo/Redo**
- [ ] **Action Undo**: Undo button → reverts last change
- [ ] **Action Redo**: Redo button → reapplies undone change
- [ ] **Multiple Actions**: Chain multiple undo/redo operations
- [ ] **State Persistence**: Undo history survives page refresh

#### **Playback State**
- [ ] **Track Continuity**: Page refresh maintains playback state
- [ ] **Queue Persistence**: Queued tracks survive refresh
- [ ] **Pause State**: Paused tracks remain paused

### 🌐 **Browser Compatibility**

#### **Core Functionality**
- [ ] **Chrome/Edge**: All features work in Chromium browsers
- [ ] **Firefox**: All features work in Firefox
- [ ] **Safari**: All features work in Safari (where supported)

#### **Web Audio API**
- [ ] **Audio Context**: Initializes correctly on user interaction
- [ ] **Node Connections**: Audio graph connects properly
- [ ] **Parameter Changes**: Real-time parameter updates work

### 🌐 **Progressive Web App (PWA) Tests**

#### **Service Worker**
- [ ] **SW Registration**: Service worker registers correctly on app load
- [ ] **Caching Strategy**: Audio files and assets cached for offline use
- [ ] **Offline Functionality**: App works without internet connection
- [ ] **Background Sync**: Configuration changes sync when online
- [ ] **Update Notifications**: New version notifications appear

#### **App Installation**
- [ ] **Install Prompt**: Browser shows install prompt on supported devices
- [ ] **Manifest Loading**: Web app manifest loads with correct metadata
- [ ] **Icons Display**: All app icons display correctly in install prompt
- [ ] **Standalone Mode**: App launches in standalone mode when installed
- [ ] **Shortcuts Work**: App shortcuts function correctly

### 🎨 **Theme System Tests**

#### **Theme Switching**
- [ ] **Dark Theme**: Dark theme applies correctly to all components
- [ ] **Light Theme**: Light theme applies correctly to all components
- [ ] **System Preference**: Respects system dark/light mode preference
- [ ] **Theme Persistence**: Selected theme persists across sessions
- [ ] **Theme Toggle**: Theme switcher button works correctly

#### **Theme Consistency**
- [ ] **Component Adaptation**: All components adapt to theme changes
- [ ] **Visual Hierarchy**: Proper contrast ratios maintained in both themes
- [ ] **Interactive Elements**: Buttons and controls styled correctly
- [ ] **Text Readability**: Text remains readable in both themes

### 📱 **Mobile Responsiveness Tests**

#### **Layout Adaptation**
- [ ] **Grid Responsiveness**: Button grid adapts from 6→11 columns
- [ ] **Header Compaction**: Header elements stack/scroll on mobile
- [ ] **Touch Targets**: All interactive elements meet 44px minimum
- [ ] **Text Scaling**: Text sizes adjust appropriately for screen size

#### **Touch Interactions**
- [ ] **Touch Playback**: Buttons respond correctly to touch input
- [ ] **Gesture Support**: Swipe and multi-touch gestures work
- [ ] **Touch Feedback**: Visual feedback on touch interactions
- [ ] **Touch Prevention**: No accidental scrolling during audio control

### ♿ **Accessibility Tests**

#### **Screen Reader Support**
- [ ] **ARIA Labels**: All interactive elements have descriptive labels
- [ ] **Live Regions**: Audio status announced to screen readers
- [ ] **Semantic HTML**: Proper heading hierarchy and landmarks
- [ ] **Focus Management**: Keyboard focus moves logically through interface

#### **Keyboard Navigation**
- [ ] **Tab Order**: Logical tab order through all controls
- [ ] **Keyboard Shortcuts**: All documented shortcuts work
- [ ] **Focus Indicators**: Visible focus indicators on all elements
- [ ] **Modal Focus**: Focus trapped in modal dialogs

### 🎹 **MIDI Integration Tests**

#### **MIDI Device Detection**
- [ ] **Device Discovery**: MIDI devices detected on connection
- [ ] **Permission Request**: Browser requests MIDI access appropriately
- [ ] **Device Listing**: Connected devices displayed in settings
- [ ] **Device Disconnection**: Graceful handling of device removal

#### **MIDI Control**
- [ ] **Note Mapping**: MIDI notes 36-96 map to buttons 0-60
- [ ] **Real-time Control**: MIDI input triggers button playback
- [ ] **Velocity Support**: Note velocity affects playback volume
- [ ] **Multiple Devices**: Multiple MIDI controllers work simultaneously

### 🎛️ **Enhanced Preset System Tests**

#### **Preset Management**
- [ ] **9 Preset Templates**: All 9 professional presets load correctly
- [ ] **Preset Switching**: Smooth transitions between presets
- [ ] **Custom Presets**: User-created presets save and load
- [ ] **Preset Validation**: Invalid presets handled gracefully

#### **Preset Application**
- [ ] **Audio Settings**: EQ, panning, and volume applied correctly
- [ ] **Playback Modes**: Correct playback modes set per preset
- [ ] **Visual Feedback**: UI updates to reflect preset changes
- [ ] **Performance**: Preset loading doesn't impact audio playback

### 🔧 **Performance & Stability Tests**

#### **Memory Management**
- [ ] **No Memory Leaks**: Extended use doesn't increase memory usage
- [ ] **Audio Cleanup**: Stopped audio releases resources properly
- [ ] **Context Management**: Audio contexts created/destroyed efficiently
- [ ] **File Handling**: Large audio files loaded without crashes

#### **Error Handling**
- [ ] **Error Boundaries**: React errors caught and displayed gracefully
- [ ] **Audio Failures**: Failed audio operations handled gracefully
- [ ] **Network Issues**: Offline functionality works when network fails
- [ ] **Storage Errors**: Full storage handled with user feedback

### 📱 **Performance Tests**

#### **Memory Management**
- [ ] **No Memory Leaks**: Extended use doesn't increase memory usage
- [ ] **Audio Cleanup**: Stopped audio releases resources
- [ ] **File Loading**: Large files load without crashing

#### **Responsiveness**
- [ ] **UI Responsiveness**: Interface remains responsive during audio playback
- [ ] **Button Response**: Buttons respond immediately to clicks
- [ ] **Settings Changes**: Parameter changes apply instantly

### 🚨 **Error Handling**

#### **File Operations**
- [ ] **Invalid Files**: Invalid audio files show error message
- [ ] **Corrupt Config**: Corrupt JSON shows error, doesn't crash
- [ ] **Storage Full**: Full storage handled gracefully

#### **Audio Errors**
- [ ] **Playback Failures**: Failed playback shows error, continues
- [ ] **Network Issues**: Network audio failures handled
- [ ] **Codec Support**: Unsupported formats show appropriate message

## Regression Prevention Protocol

### **Before Any Code Changes**
1. Run complete test suite
2. Document current behavior
3. Identify potential impact areas
4. Create backup of working state

### **After Code Changes**
1. Run all affected tests
2. Verify no new errors in console
3. Test edge cases and error conditions
4. Validate performance hasn't degraded

### **LLM Modification Guidelines**
1. **Never modify core audio logic** without human review
2. **Always test Web Audio API changes** across browsers
3. **Preserve state management integrity**
4. **Maintain backward compatibility** with saved configs
5. **Verify UI responsiveness** after changes

### **Critical Functions Protection**
- Audio playback engine
- State persistence logic
- Web Audio API integration
- User interface event handlers
- Configuration migration system

## Emergency Recovery

If regressions occur:
1. **Immediate Rollback**: Revert to last known good state
2. **Isolate Changes**: Identify which modification caused issues
3. **Test Incrementally**: Reapply changes one by one with testing
4. **Document Incident**: Add to this document for future prevention

---

**Last Updated**: 2025-09-25
**Version Tested**: 1.1.0
**Previous Version**: 1.0.0
**Test Environment**: Chrome 129+, Firefox 130+, Safari 17+, Edge 129+
**New Features Tested**: PWA, Dark/Light Themes, MIDI Integration, Mobile Responsiveness, Enhanced Accessibility