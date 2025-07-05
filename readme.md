# Todoist Task Creator

A comprehensive and multilingual plugin that allows you to create tasks in Todoist directly from your Obsidian notes with all advanced Todoist functionalities, including repetitive tasks, consolidated note generation, and an optimized design.

![Plugin Version](https://img.shields.io/badge/version-1.0.0-blue)
![Compatible](https://img.shields.io/badge/compatible-purple)
![License](https://img.shields.io/badge/license-MIT-green)
![Author](https://img.shields.io/badge/author-Jonathan%20Hernandez-orange)

## 🚀 Key Features

### ✨ Material Design Interface

- **🎨 Unified Material Design**: Complete CSS architecture restructured with flat icons
- **📱 Perfect mobile compatibility**: Interface optimized for all devices
- **🔗 API connection indicator**: Visual green/red status in settings
- **🎯 Unified elements**: Project, Priority, Reminder and Labels with consistent design
- **🏷️ Vectorial CSS icons**: Material Design icons with CSS masking in single color
- **🚩 Flag priorities**: Colored flag icons for P1-P4
- **⏰ Responsive design**: Completely optimized and consistent layout

### 🎯 Advanced Functionalities

- **🔐 Secure API configuration**: Dedicated modal with connection testing
- **🌍 Multilingual support**: Spanish and English fully supported
- **📅 Enhanced relative dates**: "Today", "Tomorrow", "This Week", "Next Week"
- **📅 Compact calendar**: Intuitive navigation with optimized design
- **⏱️ Task duration**: From 15 minutes to 8 hours
- **🔄 Recurring tasks**: Daily, weekly, monthly, yearly
- **🔄 Bidirectional synchronization**: Status between Obsidian and Todoist
- **🏷️ Automatic tag**: Includes #tasktodo automatically
- **⚡ Complete priority management** (P1-P4) with colors
- **🔔 Configurable reminder system**
- **📁 Dynamic project selection**
- **🎨 Customizable templates**

## 📥 Installation

### Manual Installation

1. **Download the files** from the plugin
2. **Create the folder** `todoist-task-creator` in `VaultFolder/.obsidian/plugins/`
3. **Copy all files** to that folder
4. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```
5. **Reload the application**
6. **Activate the plugin** in Settings > Community plugins

### ⚙️ Initial Configuration

1. **Go to Settings** > Community plugins > Todoist Task Creator
2. **Configure your API Token**:
   - Click on "Configure API Token"
   - Get your token from [Todoist Integrations](https://todoist.com/prefs/integrations)
   - **Verify connection**: Green indicator ✓ = connected, red ✗ = error
3. **Select your language**: Spanish or English
4. **Enable synchronization** (recommended):
   - Activate bidirectional synchronization
   - Configure interval (30-300 seconds)
5. **Customize settings** according to your preferences

## 🎯 Plugin Usage

### 📝 Create Complete Task

**Method 1:** Command palette
1. `Ctrl+P` (or `Cmd+P` on Mac)
2. Search "Create Todoist task"
3. Complete the optimized form

**Method 2:** From selected text
1. Select text in your note
2. `Ctrl+P` → "Create task from selection"

**Method 3:** Generate consolidated note
1. `Ctrl+P` (or `Cmd+P` on Mac)
2. Search "Generate consolidated note"
3. A unified view of all your tasks is automatically created

### 🎨 Optimized Interface

#### **Material Design Layout v1.0.0:**
```
┌─────────────────────────────────────┐
│ Task name                           │
│ Description                         │
│ [📁] Project    │ [🚩] Priority     │
│ [📅] Date       │ [⏰] Duration     │
│ [🔔] Reminder   │ [🏷️] Labels       │
│ ☑ Insert in note                   │
│ [Cancel]        [Create Task]       │
└─────────────────────────────────────┘
```

**🎯 Material Design improvements:**
- **Unified CSS icons**: Material Design with CSS masks in single color
- **Completely consistent design**: All elements with identical behavior
- **No icon movement**: Absolute positioning for visual stability
- **Colored flag priorities**: P1-P4 with specific flag icons

#### **Form Fields:**

**📋 Required:**
- **Content**: Main task description

**📄 Optional (Material Design):**
- **Description**: Additional information (compact field)
- **[📁] Project**: Unified button with modal - project list
- **[🚩] Priority**: Button with colored flags - P1 to P4 with specific colors
- **[📅] Date**: Calendar modal with integrated repetition
- **[⏰] Duration**: Unified button - 15min to 8 hours (optional)
- **[🔔] Reminder**: Unified button - predefined alerts
- **[🏷️] Labels**: Unified button with modal - multiple selection
- **☑ Insert in note**: Compact checkbox

**🎨 Material Design CSS Icons:**
- 📁 **Project**: Unified folder icon
- 🚩 **Priority**: Colored flags (P1-red, P2-orange, P3-blue, P4-gray)
- 🔔 **Reminder**: Unified bell icon
- 🏷️ **Labels**: Unified tag icon
- ⏰ **Duration**: Unified clock icon

### 📅 Enhanced Date Selector

#### **🚀 Quick Options:**
- **Today** - Current date
- **Tomorrow** - Next day
- **This Week** - End of current week
- **Next Week** - End of next week

#### **📅 Custom Calendar:**
- Compact and efficient design
- Navigation with arrows ‹ ›
- Current day automatically highlighted
- Past days visually dimmed

### ⏰ Optimized Time Selector

- **🎯 15-minute precision**: 00:00, 00:15, 00:30, 00:45...
- **📋 Compact list** with automatic scroll
- **🕐 24-hour format**
- **⚡ Current time highlighted**

### ⏱️ Task Duration

Configure estimated completion time:
- **15-45 minutes**: Quick tasks
- **1-2 hours**: Standard tasks
- **3-8 hours**: Extensive projects

### 🔄 Integrated Repeat Function

**📌 Repeat integrated in Date:**
The repeat function is now integrated directly in the date selection modal, providing a smoother and more compact experience.

**🎯 Available options:**
- **Every day**: Daily repetition
- **Every week**: Same day each week
- **Every weekday**: Only Monday to Friday
- **Every month**: Same day each month
- **Every year**: Annual special dates

**💡 Integrated design advantages:**
- **📌 Unified flow**: Date and repetition in one step
- **⚡ Faster**: Fewer clicks to configure recurring tasks
- **📱 Mobile optimized**: Fewer modals, better touch experience
- **🎨 Clean interface**: No additional buttons

**🏷️ Automatic functionality:**
- **#repeattodo**: Automatic tag on repetitive tasks
- **🔄 Synchronization**: Compatible with native Todoist
- **📋 Specific template**: Customizable format for recurrents

### 📋 Consolidated Note **NEW**

Automatically generates a unified view of all your Todoist tasks:

**🎯 Functionalities:**
- **📊 Centralized view**: All tasks in a single Obsidian note
- **🔍 Smart filtering**: By specific projects and labels
- **📁 Project organization**: Automatic grouping with counters
- **⚡ Automatic prioritization**: Sorted by priority and due date
- **📈 Statistical summary**: Total task and project counter
- **🔗 Direct links**: Each task links directly to Todoist
- **🎨 Enriched format**: Visual priorities and formatted labels
- **🔄 Auto-refresh**: Automatically updates every 1 minute (configurable)

**🛠️ Configuration:**
1. **Note path**: Define where the consolidated note will be created
2. **Project filters**: Select specific projects (optional)
3. **Label filters**: Select specific labels (optional)
4. **Auto-refresh**: Automatic updates every 1, 5, 30, or 60 minutes
5. **Automatic generation**: A command generates the entire view

**📋 Output example:**
```markdown
# Consolidated Todoist Tasks

## Work (5)
- [ ] **Review client proposal** [📋](https://todoist.com/task/123) P1 #urgent 📅 today
- [ ] **Prepare presentation** [📋](https://todoist.com/task/124) P2 #meeting 📅 tomorrow

## Personal (3)
- [ ] **Buy groceries** [📋](https://todoist.com/task/125) P3 #shopping 📅 this week

---

**Summary**: 8 tasks across 2 projects
```

### ⏰ Optional Time **NEW**

The time function is now completely optional:

**🔧 Configuration:**
- **❌ Disabled by default**: Time selector doesn't appear automatically
- **⚙️ Manual activation**: Enable in settings if you need specific time
- **🎯 Simplified focus**: Cleaner interface without unnecessary fields
- **⚡ Better performance**: Fewer elements in the form

**💡 Benefits:**
- **🚀 Faster creation**: Fewer fields to complete
- **🎨 Cleaner interface**: Only the essential visible
- **🔧 Total control**: Activate only if you need it
- **📱 Better on mobile**: Fewer touch elements

### ⚡ Colored Priorities

- **P1 (Urgent)** - 🔴 Red - Critical tasks
- **P2 (High)** - 🟠 Orange - Important tasks
- **P3 (Medium)** - 🔵 Blue - Normal tasks
- **P4 (Low)** - ⚫ Gray - Low priority tasks

### 🏷️ Enhanced Visual Labels

- **🎨 Visual list**: Shows tags as colored pills
- **🔄 Preserved colors**: Maintains Todoist colors
- **📦 Compact view**: First 3 labels + "..." if more
- **✅ Clear selection**: Green check on selected labels

### 🔄 Bidirectional Synchronization

- **✅ Mark in Obsidian**: Automatically updates in Todoist
- **⬅️ Automatic synchronization**: Todoist changes reflected in Obsidian
- **⚡ Optimized system**: Debounce to avoid excessive calls
- **🔍 Precise detection**: Recognizes specific checkbox changes

### 📝 Note Reference

When you create a task, it's automatically inserted:

```markdown
- [ ] Review proposal [📋](https://todoist.com/task/123) P2 work, urgent 📅 2025-01-15 Detailed description #tasktodo
```

### 🎨 Template Variables

Customize the format with:
- `{{content}}` - Task content
- `{{url}}` - Direct link to Todoist
- `{{id}}` - Unique task ID
- `{{priority}}` - Priority with colors (P1-P4)
- `{{labels}}` - Labels with preserved colors
- `{{due}}` - Formatted due date
- `{{description}}` - Task description

## ⚙️ Advanced Settings

### 🔗 API Connection Status

- **✅ Green indicator**: API connected correctly
- **❌ Red indicator**: Connection problem or invalid token
- **🧪 Test button**: Verify connection before saving
- **🔄 Automatic update**: Updates when changing settings

### ⏱️ Time Settings

- **⏰ Default time**: Default time (e.g., 08:00)
- **⏱️ Default duration**: Standard duration (15-480 minutes)
- **🎯 Intuitive sliders**: Easy configuration with tooltips

### 🔄 Optimized Synchronization

- **🔧 Configurable interval**: 30-300 seconds
- **⚡ Efficient system**: Debounce for better performance
- **🎯 Precise detection**: Only relevant changes

### 🔄 Consolidated Note Auto-refresh

- **🔧 Configurable interval**: 1, 5, 30, or 60 minutes
- **⚡ Automatic updates**: No manual intervention needed
- **🎯 Smart updates**: Only when API connection is available

### 🎨 Customization

- **🌍 Language**: Spanish or English
- **📁 Default project**: Default project ID
- **📝 Customizable template**: Inserted text format
- **🔄 Auto-refresh**: Automatic data update
- **💾 Insert by default**: Always include reference in note

## 🛠️ Performance Optimizations

### ⚡ Smart Cache
- **📦 5-minute cache** for projects and labels
- **🔄 Selective update** only when necessary
- **💾 Local persistence** of task mappings

### 🎯 UX Optimizations
- **⏱️ 1-second debounce** on editor changes
- **🔄 Throttling** on API calls
- **⚡ Asynchronous processing** for better experience
- **📱 Completely responsive design**

## 🐛 Troubleshooting

### 🔴 Red API Indicator
- ✅ Verify your API token is correct
- ✅ Use "Test Connection" in settings
- ✅ Confirm your Todoist account is active
- ✅ Check your internet connection

### ❌ Synchronization Not Working
- ✅ Enable synchronization in settings
- ✅ Confirm green API indicator
- ✅ Verify tasks have #tasktodo tag
- ✅ Reduce synchronization interval

### 🎨 Labels Don't Appear
- ✅ Configure labels in Todoist first
- ✅ Activate auto-refresh in settings
- ✅ Refresh data manually

### 📱 Design Issues
- ✅ Reload Obsidian after changes
- ✅ Verify you have the latest version
- ✅ Clear browser cache if necessary

## 📁 Plugin Structure

```
todoist-task-creator/
├── main.ts              # Optimized main code
├── manifest.json        # Plugin metadata
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── esbuild.config.mjs   # Build configuration
├── styles.css           # Optimized Todoist-style styles
├── versions.json        # Version compatibility
├── .gitignore          # Files to ignore
└── README.md           # This documentation
```

## 🏆 Changelog

### v1.0.0 - Initial Release 🚀
- 🎉 Complete base functionality for task creation
- 🔐 Secure modal for API token
- 🌍 Multilingual support (ES/EN)
- 📅 Visual calendar
- ⚡ Colored priorities
- 🔄 Basic synchronization system
- 🎨 Material Design interface with unified components
- 📱 Complete mobile compatibility
- 🔄 Recurring tasks with automatic tagging
- 📋 Consolidated note with auto-refresh
- ⏰ Optional time selection
- 🚩 Priority flag icons
- 🏷️ Enhanced visual labels
- ⚡ Smart caching and performance optimizations

## 📄 License

MIT License - Free to use, modify and distribute.

## 🤝 Contributing

Contributions are welcome:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📧 Support

If you encounter problems or have suggestions:

- 📋 **Review the troubleshooting section**
- 🔗 **Verify the API indicator is green**
- 📦 **Confirm you have the latest version v1.0.0**
- 🐛 **Open an issue** with problem details

## 🌟 Key Features v1.0

### 🎯 Superior User Experience
- **⚡ Faster**: Smart cache and optimizations
- **🎨 Material Design**: Unified CSS architecture with vector icons
- **📱 Perfect compatibility**: Completely optimized responsive design
- **🔧 More reliable**: Status indicators and better error handling
- **📋 More organized**: Consolidated view of all tasks
- **🎯 Consistent interface**: All elements with identical behavior

### 🚀 Maximized Productivity
- **⏰ Quick dates**: "Today" or "Tomorrow" with one click
- **⏱️ Precise duration**: Enhanced planning
- **🔄 Automatic repetition**: Habits and routines with #repeattodo
- **🚩 Visual priorities**: Colored flags for instant identification
- **🏷️ Functional labels**: Dedicated modal with multiple selection
- **📊 Unified view**: Smart consolidation by project and labels
- **⚙️ Granular control**: Optional time, customizable filters

---

**Plugin with unified Material Design and perfect mobile compatibility! 🚀📱**

> *Developed with ❤️ by Jonathan Hernandez*
> 
> **Repository**: [https://github.com/jonathanhher/todoist-task-creator](https://github.com/jonathanhher/todoist-task-creator)
> 
> **Current version**: 1.0.0 - Unified Material Design architecture with vectorial CSS icons