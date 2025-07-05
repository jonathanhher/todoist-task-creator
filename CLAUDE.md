# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run dev` - Start development build with watch mode
- `npm run build` - Build for production with TypeScript checking
- `npm run clean` - Remove build artifacts (main.js, main.js.map)
- `npm run rebuild` - Clean and build from scratch
- `npm run lint` - Run TypeScript linting
- `npm run typecheck` - Run TypeScript type checking without emitting files

### Testing
No automated tests are configured. Manual testing is done by:
1. Building the plugin (`npm run build`)
2. Loading it in Obsidian's plugin directory
3. Testing functionality through the Obsidian interface

## Architecture Overview

This is an Obsidian plugin that integrates with Todoist API to create and sync tasks. Key architectural components:

### Core Structure
- **main.ts**: Single-file plugin containing all functionality (~2000+ lines)
- **manifest.json**: Plugin metadata and permissions (v1.0.0)
- **styles.css**: Material Design CSS architecture with unified components (~1000+ lines)
- **esbuild.config.mjs**: Build configuration for TypeScript compilation

### Key Classes and Interfaces
- `TodoistPlugin`: Main plugin class extending Obsidian's Plugin
- `TodoistPluginSettings`: Configuration interface with API token, sync settings, UI preferences
- `TodoistTaskModal`: Modal for creating tasks with comprehensive form fields
- `ApiTokenModal`: Secure modal for API token configuration
- `TodoistSettingTab`: Settings tab with visual connection status indicators

### API Integration
- Todoist REST API v2 integration via fetch requests
- Task creation with full metadata (projects, labels, priorities, dates, recurrence)
- Bidirectional sync between Obsidian checkboxes and Todoist task completion
- Smart caching (5-minute cache for projects/labels)

### UI Components - Material Design v1.0.0
- **Unified Design System**: All form elements use consistent `.unified-select` and `.unified-button` classes
- **CSS Masking Icons**: Material Design icons implemented via CSS masks in a single color
- **Priority Flag Icons**: Colored flag icons for P1-P4 priorities (red, orange, blue, gray)
- **Absolute Icon Positioning**: Icons use absolute positioning to prevent movement on hover
- **Modal-based Selectors**: Projects, priorities, labels use dedicated modals for better UX
- Custom date picker with relative dates (Today, Tomorrow, This Week, Next Week)
- Time selector with 15-minute intervals (optional)
- Duration selector (15min to 8 hours, integrated in date section)
- Responsive design optimized for mobile and desktop
- Complete visual consistency across all interface elements

### Synchronization System
- Debounced sync to avoid excessive API calls
- Task mapping persistence using Obsidian's data storage
- Automatic detection of checkbox state changes
- Configurable sync intervals (30-300 seconds)

### Multi-language Support
- Spanish and English translations
- Comprehensive translation object covering all UI elements
- Language-specific date formatting and validation
- Default language: English

## Code Patterns

### Settings Management
Settings are stored in `TodoistPluginSettings` interface with defaults in `DEFAULT_SETTINGS`. All settings have visual indicators and validation.

### Error Handling
- Visual connection status indicators (green/red)
- Graceful fallbacks for API failures
- User-friendly error messages with translations
- Debounced retry mechanisms

### Data Flow
1. User creates task via command palette or modal
2. Task data validated and formatted
3. API call to Todoist with full metadata
4. Response processed and task reference inserted in note
5. Sync system monitors for changes and updates both systems

### Performance Optimizations
- Intelligent caching for API responses
- Debounced user input handling
- Throttled sync operations
- Efficient DOM manipulation for responsive UI
- **Material Design CSS Architecture**: Optimized CSS with unified classes for better performance
- **SVG Icon Masking**: Vector icons loaded efficiently via CSS masks
- **Reduced DOM Complexity**: Simplified structure with consistent styling patterns

## Important Implementation Details

### Task Template System
Uses template variables like `{{content}}`, `{{url}}`, `{{priority}}`, `{{labels}}`, `{{due}}`, `{{description}}` for customizable task insertion format. Supports separate templates for regular tasks (#tasktodo) and repetitive tasks (#repeattodo).

### Recurrence Handling
Supports daily, weekly, monthly, and yearly recurrence patterns with proper Todoist API format conversion. Repetitive tasks automatically receive the #repeattodo tag for easy identification.

### Consolidated Note Generation
Feature that generates a unified view of all Todoist tasks:
- Fetches all tasks via Todoist API
- Filters by user-configured projects and labels
- Groups tasks by project with counters
- Sorts by priority and due date
- Creates formatted Obsidian note with direct links
- Includes statistical summary
- **Auto-refresh**: Automatically updates at configurable intervals (1, 5, 30, 60 minutes)

### Optional Time Selection
Time selection is completely optional and disabled by default:
- Controlled by `enableTimeSelection` setting
- When disabled, time fields are hidden from UI
- Simplifies task creation workflow
- Can be enabled in settings if needed

### Checkbox Sync Logic
Monitors markdown content changes and maps checkbox states to Todoist task IDs for bidirectional synchronization. Supports both #tasktodo and #repeattodo tags.

### Security Considerations
- API tokens stored securely in Obsidian's settings
- No sensitive data logged or exposed
- Secure token input modal with masked display
- Automatic directory creation with proper error handling

### Material Design Implementation v1.0.0
- **Unified CSS Classes**: `.unified-select`, `.unified-button`, `.todoist-modal` for consistent styling
- **Icon System**: SVG icons implemented via CSS `mask` property for single-color vector graphics
- **Priority Visual System**: Color-coded flag icons for P1 (red), P2 (orange), P3 (blue), P4 (gray)
- **Mobile Optimization**: Complete responsive design with touch-friendly interface
- **Accessibility**: High contrast, clear visual hierarchy, consistent interaction patterns
- **Performance**: Optimized CSS architecture with minimal DOM manipulation

### Auto-refresh System
- **Consolidated Note Auto-refresh**: Configurable intervals (1, 5, 30, 60 minutes)
- **Cache Refresh**: 5-minute intervals for projects and labels
- **Smart Updates**: Only when API connection is available
- **Performance Optimized**: Debounced operations to prevent excessive API calls