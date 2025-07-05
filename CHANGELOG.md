# Changelog

All notable changes to the Todoist Task Creator plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-05

### Added
- **Complete Task Creation System**: Full integration with Todoist API v2
- **Material Design Interface**: Unified CSS architecture with flat Material Design icons
- **Multilingual Support**: Complete Spanish and English translations
- **API Token Security**: Secure modal for API configuration with connection testing
- **Visual Calendar**: Compact date picker with relative dates (Today, Tomorrow, This Week, Next Week)
- **Priority System**: Color-coded P1-P4 priorities with flag icons
- **Bidirectional Sync**: Real-time synchronization between Obsidian and Todoist
- **Recurring Tasks**: Daily, weekly, monthly, yearly repetition with automatic #repeattodo tagging
- **Consolidated Note**: Auto-refreshing unified view of all Todoist tasks
- **Smart Filtering**: Project and label filters for consolidated notes
- **Optional Time Selection**: Configurable time input (disabled by default)
- **Task Duration**: Configurable duration from 15 minutes to 8 hours
- **Visual Labels**: Enhanced tag display with preserved Todoist colors
- **Template System**: Customizable task insertion format with variables
- **Performance Optimizations**: Smart 5-minute caching and debounced operations
- **Mobile Compatibility**: Complete responsive design for all devices
- **Auto-refresh System**: Configurable intervals for consolidated notes (1, 5, 30, 60 minutes)

### Technical Features
- **TypeScript Implementation**: Full type safety with Obsidian Plugin API
- **CSS Masking Icons**: Vector icons implemented via CSS masks for single-color consistency
- **Absolute Icon Positioning**: Prevents icon movement on hover
- **Debounced Operations**: 1-second debounce on editor changes for performance
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Data Persistence**: Secure storage using Obsidian's built-in data system
- **API Integration**: Complete Todoist REST API v2 integration

### Interface Features
- **Unified Button Design**: Consistent `.unified-select` and `.unified-button` classes
- **Modal-based Selectors**: Projects, priorities, and labels use dedicated modals
- **Responsive Layout**: Optimized for both desktop and mobile devices
- **Visual Status Indicators**: Green/red API connection status
- **Compact Forms**: Efficient use of screen space with Material Design principles

### Commands
- **Create Todoist Task**: Main task creation command
- **Create Task from Selection**: Convert selected text to task
- **Generate Consolidated Note**: Create unified task view

### Settings
- **API Configuration**: Secure token management with connection testing
- **Language Selection**: English (default) or Spanish
- **Sync Settings**: Configurable synchronization intervals
- **Time Settings**: Optional time selection and default values
- **Template Customization**: Personalized task insertion formats
- **Auto-refresh Configuration**: Consolidated note update intervals
- **Project and Label Filters**: Customizable consolidated note filtering

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Now removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
- **Technical**: Development and build changes