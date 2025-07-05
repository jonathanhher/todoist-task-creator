// main.ts - Todoist Task Creator Plugin
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownFileInfo, TFile } from 'obsidian';

interface TodoistPluginSettings {
    apiToken: string;
    defaultProject: string;
    taskTemplate: string;
    insertTaskInNote: boolean;
    taskNoteTemplate: string;
    repeatTaskTemplate: string;
    autoRefresh: boolean;
    refreshInterval: number;
    language: 'en' | 'es';
    enableSync: boolean;
    syncInterval: number;
    defaultTime: string;
    defaultDuration: number;
    enableTimeSelection: boolean;
    consolidatedNotePath: string;
    consolidatedNoteFilters: {
        projects: string[];
        labels: string[];
    };
    autoRefreshConsolidated: boolean;
    consolidatedRefreshInterval: number;
}

const DEFAULT_SETTINGS: TodoistPluginSettings = {
    apiToken: '',
    defaultProject: '',
    taskTemplate: '{{content}}',
    insertTaskInNote: true,
    taskNoteTemplate: '- [ ] {{content}} [📋]({{url}}) {{priority}} {{labels}} {{due}} {{description}} #tasktodo',
    repeatTaskTemplate: '- [ ] {{content}} [📋]({{url}}) {{priority}} {{labels}} {{due}} {{description}} #repeattodo',
    autoRefresh: false,
    refreshInterval: 300,
    language: 'en',
    enableSync: true,
    syncInterval: 60,
    defaultTime: '08:00',
    defaultDuration: 60,
    enableTimeSelection: false,
    consolidatedNotePath: 'tasks/consolidated-tasks',
    consolidatedNoteFilters: {
        projects: [],
        labels: []
    },
    autoRefreshConsolidated: true,
    consolidatedRefreshInterval: 60
}

const translations = {
    en: {
        'createTask': 'Create Todoist Task',
        'taskContent': 'Task Content',
        'taskContentPlaceholder': 'Write your task content...',
        'description': 'Description (optional)',
        'descriptionPlaceholder': 'Additional task description...',
        'project': 'Project',
        'inbox': 'Inbox',
        'priority': 'Priority',
        'deadline': 'Due Date',
        'dueTime': 'Due Time (optional)',
        'duration': 'Duration (optional)',
        'reminder': 'Reminder',
        'repeat': 'Repeat',
        'optional': 'Optional',
        'noDuration': 'No duration',
        'labels': 'Labels',
        'insertInNote': 'Insert in note',
        'cancel': 'Cancel',
        'createTaskBtn': 'Create Task',
        'selectDate': 'Date',
        'selectTime': 'Time',
        'selectDuration': 'Duration',
        'noReminder': 'No reminder',
        'p1Urgent': 'P1 - Urgent',
        'p2High': 'P2 - High',
        'p3Medium': 'P3 - Medium',
        'p4Low': 'P4 - Low',
        '5minBefore': '5 minutes before',
        '15minBefore': '15 minutes before',
        '30minBefore': '30 minutes before',
        '1hourBefore': '1 hour before',
        '2hoursBefore': '2 hours before',
        '1dayBefore': '1 day before',
        'createTaskCommand': 'Create Todoist task',
        'createFromSelection': 'Create task from selection',
        'settingsTitle': 'Todoist Configuration',
        'apiToken': 'API Token',
        'apiTokenDesc': 'Your Todoist API token. Click to configure.',
        'defaultProject': 'Default Project',
        'defaultProjectDesc': 'Default project ID for new tasks (optional)',
        'taskTemplate': 'Task template in note',
        'taskTemplateDesc': 'Format of text inserted in note. Use {{content}}, {{url}}, {{id}}, {{priority}}, {{labels}}, {{due}}, {{description}}',
        'insertByDefault': 'Insert in note by default',
        'insertByDefaultDesc': 'Always insert task reference in current note',
        'autoRefresh': 'Auto refresh',
        'autoRefreshDesc': 'Automatically refresh projects and labels',
        'refreshInterval': 'Refresh interval (seconds)',
        'refreshIntervalDesc': 'How often to refresh data from Todoist',
        'language': 'Language',
        'languageDesc': 'Plugin interface language',
        'configureToken': 'Configure API Token',
        'taskCreated': 'Task created',
        'configureApiFirst': 'Configure your Todoist API token first',
        'selectTextFirst': 'Select text to create a task',
        'enterTaskContent': 'Enter task content',
        'errorCreatingTask': 'Error creating task',
        'tokenModalTitle': 'Configure Todoist API Token',
        'tokenModalDesc': 'Get your API token from Todoist integrations settings',
        'tokenPlaceholder': 'Enter your API token...',
        'getTokenLink': 'Get your token here',
        'save': 'Save',
        'tokenSaved': 'API token saved successfully',
        'creating': 'Creating task...',
        'enableSync': 'Enable synchronization',
        'enableSyncDesc': 'Sync task status between Obsidian and Todoist',
        'syncInterval': 'Sync interval (seconds)',
        'syncIntervalDesc': 'How often to check for task updates',
        'defaultTime': 'Default time',
        'defaultTimeDesc': 'Default time when creating tasks with due date',
        'defaultDuration': 'Default duration (minutes)',
        'defaultDurationDesc': 'Default task duration in minutes',
        'taskCompleted': 'Task completed in Todoist',
        'taskUncompleted': 'Task reopened in Todoist',
        'syncError': 'Sync error',
        'apiStatus': 'API Connection Status',
        'apiConnected': 'Connected',
        'apiDisconnected': 'Disconnected',
        'testConnection': 'Test Connection',
        'today': 'Today',
        'tomorrow': 'Tomorrow',
        'thisWeek': 'This Week',
        'nextWeek': 'Next Week',
        'customDate': 'Custom Date',
        'repeatTask': 'Repeat Task',
        'noRepeat': 'No repeat',
        'daily': 'Daily',
        'weekly': 'Weekly (same day)',
        'weekdays': 'Weekdays (Mon-Fri)',
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'generateConsolidatedNote': 'Generate consolidated note',
        'consolidatedNotePath': 'Consolidated note path',
        'consolidatedNotePathDesc': 'Path where consolidated task note will be created',
        'selectProjects': 'Select projects',
        'selectLabels': 'Select labels',
        'noProjectsSelected': 'No projects selected',
        'noLabelsSelected': 'No labels selected',
        'enableTimeSelection': 'Enable time selection',
        'enableTimeSelectionDesc': 'Allow time selection for tasks (disabled by default)',
        'consolidatedNoteGenerated': 'Consolidated note generated',
        'consolidatedFilters': 'Consolidated note filters',
        'autoRefreshConsolidated': 'Auto-refresh consolidated note',
        'autoRefreshConsolidatedDesc': 'Automatically refresh the consolidated note at regular intervals',
        'consolidatedRefreshInterval': 'Consolidated refresh interval',
        'consolidatedRefreshIntervalDesc': 'How often to refresh the consolidated note (minutes)',
        '15min': '15 minutes',
        '30min': '30 minutes',
        '45min': '45 minutes',
        '1hour': '1 hour',
        '1hour30min': '1 hour 30 minutes',
        '2hours': '2 hours',
        '2hours30min': '2 hours 30 minutes',
        '3hours': '3 hours',
        '4hours': '4 hours',
        '5hours': '5 hours',
        '6hours': '6 hours',
        '7hours': '7 hours',
        '8hours': '8 hours'
    },
    es: {
        'createTask': 'Crear Tarea en Todoist',
        'taskContent': 'Contenido de la Tarea',
        'taskContentPlaceholder': 'Escribe el contenido de tu tarea...',
        'description': 'Descripción (opcional)',
        'descriptionPlaceholder': 'Descripción adicional de la tarea...',
        'project': 'Proyecto',
        'inbox': 'Bandeja de Entrada',
        'priority': 'Prioridad',
        'deadline': 'Fecha Límite',
        'dueTime': 'Hora Límite (opcional)',
        'duration': 'Duración (opcional)',
        'reminder': 'Recordatorio',
        'repeat': 'Repetir',
        'opcional': 'Opcional',
        'noDuration': 'Sin duración',
        'labels': 'Etiquetas',
        'insertInNote': 'Insertar en nota',
        'cancel': 'Cancelar',
        'createTaskBtn': 'Crear Tarea',
        'selectDate': 'Fecha',
        'selectTime': 'Hora',
        'selectDuration': 'Duración',
        'noReminder': 'Sin recordatorio',
        'p1Urgent': 'P1 - Urgente',
        'p2High': 'P2 - Alta',
        'p3Medium': 'P3 - Media',
        'p4Low': 'P4 - Baja',
        '5minBefore': '5 minutos antes',
        '15minBefore': '15 minutos antes',
        '30minBefore': '30 minutos antes',
        '1hourBefore': '1 hora antes',
        '2hoursBefore': '2 horas antes',
        '1dayBefore': '1 día antes',
        'createTaskCommand': 'Crear tarea en Todoist',
        'createFromSelection': 'Crear tarea desde selección',
        'settingsTitle': 'Configuración de Todoist',
        'apiToken': 'Token de API',
        'apiTokenDesc': 'Tu token de API de Todoist. Haz clic para configurar.',
        'defaultProject': 'Proyecto por Defecto',
        'defaultProjectDesc': 'ID del proyecto donde se crearán las tareas por defecto (opcional)',
        'taskTemplate': 'Plantilla de tarea en nota',
        'taskTemplateDesc': 'Formato del texto que se insertará en la nota. Usa {{content}}, {{url}}, {{id}}, {{priority}}, {{labels}}, {{due}}, {{description}}',
        'insertByDefault': 'Insertar en nota por defecto',
        'insertByDefaultDesc': 'Siempre insertar referencia de la tarea en la nota actual',
        'autoRefresh': 'Actualización automática',
        'autoRefreshDesc': 'Actualizar automáticamente proyectos y etiquetas',
        'refreshInterval': 'Intervalo de actualización (segundos)',
        'refreshIntervalDesc': 'Cada cuánto tiempo actualizar datos de Todoist',
        'language': 'Idioma',
        'languageDesc': 'Idioma de la interfaz del plugin',
        'configureToken': 'Configurar Token de API',
        'taskCreated': 'Tarea creada',
        'configureApiFirst': 'Configura tu token de API de Todoist primero',
        'selectTextFirst': 'Selecciona texto para crear una tarea',
        'enterTaskContent': 'Ingresa el contenido de la tarea',
        'errorCreatingTask': 'Error al crear tarea',
        'tokenModalTitle': 'Configurar Token de API de Todoist',
        'tokenModalDesc': 'Obtén tu token de API desde las configuraciones de integraciones de Todoist',
        'tokenPlaceholder': 'Ingresa tu token de API...',
        'getTokenLink': 'Obtén tu token aquí',
        'save': 'Guardar',
        'tokenSaved': 'Token de API guardado exitosamente',
        'creating': 'Creando tarea...',
        'enableSync': 'Habilitar sincronización',
        'enableSyncDesc': 'Sincronizar estado de tareas entre Obsidian y Todoist',
        'syncInterval': 'Intervalo de sincronización (segundos)',
        'syncIntervalDesc': 'Cada cuánto tiempo verificar actualizaciones de tareas',
        'defaultTime': 'Hora por defecto',
        'defaultTimeDesc': 'Hora predeterminada al crear tareas con fecha límite',
        'defaultDuration': 'Duración por defecto (minutos)',
        'defaultDurationDesc': 'Duración predeterminada de tareas en minutos',
        'taskCompleted': 'Tarea completada en Todoist',
        'taskUncompleted': 'Tarea reabierta en Todoist',
        'syncError': 'Error de sincronización',
        'apiStatus': 'Estado de Conexión API',
        'apiConnected': 'Conectado',
        'apiDisconnected': 'Desconectado',
        'testConnection': 'Probar Conexión',
        'today': 'Hoy',
        'tomorrow': 'Mañana',
        'thisWeek': 'Esta Semana',
        'nextWeek': 'Próxima Semana',
        'customDate': 'Fecha Personalizada',
        'repeatTask': 'Repetir Tarea',
        'noRepeat': 'No repetir',
        'daily': 'Diariamente',
        'weekly': 'Semanalmente (mismo día)',
        'weekdays': 'Días laborales (Lun-Vie)',
        'monthly': 'Mensualmente',
        'yearly': 'Anualmente',
        'generateConsolidatedNote': 'Generar nota consolidada',
        'consolidatedNotePath': 'Ruta de nota consolidada',
        'consolidatedNotePathDesc': 'Ruta donde se creará la nota consolidada de tareas',
        'selectProjects': 'Seleccionar proyectos',
        'selectLabels': 'Seleccionar etiquetas',
        'noProjectsSelected': 'No hay proyectos seleccionados',
        'noLabelsSelected': 'No hay etiquetas seleccionadas',
        'enableTimeSelection': 'Habilitar selección de tiempo',
        'enableTimeSelectionDesc': 'Permitir selección de tiempo para tareas (deshabilitado por defecto)',
        'consolidatedNoteGenerated': 'Nota consolidada generada',
        'consolidatedFilters': 'Filtros de nota consolidada',
        'autoRefreshConsolidated': 'Auto-actualizar nota consolidada',
        'autoRefreshConsolidatedDesc': 'Actualizar automáticamente la nota consolidada a intervalos regulares',
        'consolidatedRefreshInterval': 'Intervalo de actualización consolidada',
        'consolidatedRefreshIntervalDesc': 'Cada cuánto tiempo actualizar la nota consolidada (minutos)',
        '15min': '15 minutos',
        '30min': '30 minutos',
        '45min': '45 minutos',
        '1hour': '1 hora',
        '1hour30min': '1 hora 30 minutos',
        '2hours': '2 horas',
        '2hours30min': '2 horas 30 minutos',
        '3hours': '3 horas',
        '4hours': '4 horas',
        '5hours': '5 horas',
        '6hours': '6 horas',
        '7hours': '7 horas',
        '8hours': '8 horas'
    }
};

interface TodoistTask {
    id: string;
    content: string;
    description: string;
    project_id: string;
    url: string;
    priority: number;
    labels: string[];
    is_completed: boolean;
    due?: {
        date: string;
        string: string;
        datetime?: string;
        recurring?: boolean;
    };
    duration?: {
        amount: number;
        unit: string;
    };
}

interface TodoistProject {
    id: string;
    name: string;
    color: string;
}

interface TodoistLabel {
    id: string;
    name: string;
    color: string;
}

interface TaskCreationData {
    content: string;
    description?: string;
    project_id?: string;
    due_date?: string;
    due_datetime?: string;
    due_string?: string;
    priority: number;
    labels: string[];
    reminder?: string;
    duration?: number;
    duration_unit?: string;
}

interface TaskMapping {
    todoistId: string;
    file: string;
    line: number;
    lineContent: string;
}

export default class TodoistPlugin extends Plugin {
    settings: TodoistPluginSettings;
    refreshInterval: NodeJS.Timeout | null = null;
    syncInterval: NodeJS.Timeout | null = null;
    consolidatedRefreshInterval: NodeJS.Timeout | null = null;
    
    private projectsCache: TodoistProject[] = [];
    private labelsCache: TodoistLabel[] = [];
    private lastFetch: number = 0;
    private cacheDuration: number = 5 * 60 * 1000;
    private taskMappings: Map<string, TaskMapping> = new Map();
    public apiStatus: boolean = false;
    private debounceTimeout: NodeJS.Timeout | null = null;

    async onload() {
        await this.loadSettings();
        await this.loadTaskMappings();

        this.addCommand({
            id: 'create-todoist-task',
            name: this.t('createTaskCommand'),
            callback: () => {
                new CreateTaskModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'create-task-from-selection',
            name: this.t('createFromSelection'),
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection();
                if (selection) {
                    this.createTaskFromText(selection);
                } else {
                    new Notice(this.t('selectTextFirst'));
                }
            }
        });

        this.addCommand({
            id: 'generate-consolidated-note',
            name: this.t('generateConsolidatedNote'),
            callback: () => {
                this.generateConsolidatedNote();
            }
        });

        this.addSettingTab(new TodoistSettingTab(this.app, this));

        if (this.settings.autoRefresh) {
            this.startAutoRefresh();
        }

        if (this.settings.enableSync) {
            this.startSync();
        }

        if (this.settings.autoRefreshConsolidated) {
            this.startConsolidatedRefresh();
        }

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
                if (this.settings.enableSync && view instanceof MarkdownView) {
                    this.debounceEditorChange(editor, view);
                }
            })
        );

        this.registerEvent(
            this.app.vault.on('modify', (file: TFile) => {
                if (this.settings.enableSync && file.extension === 'md') {
                    this.debounceFileChange(file);
                }
            })
        );

        this.preloadData();
        this.testApiConnection();
    }

    onunload() {
        this.stopAutoRefresh();
        this.stopSync();
        this.stopConsolidatedRefresh();
        this.saveTaskMappings();
    }

    t(key: string): string {
        return translations[this.settings.language][key] || key;
    }

    private debounceEditorChange(editor: Editor, view: MarkdownView) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.handleEditorChange(editor, view);
        }, 1000);
    }

    private debounceFileChange(file: TFile) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.handleFileChange(file);
        }, 1000);
    }

    async testApiConnection(): Promise<boolean> {
        if (!this.settings.apiToken) {
            this.apiStatus = false;
            return false;
        }

        try {
            const response = await fetch('https://api.todoist.com/rest/v2/projects', {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });
            this.apiStatus = response.ok;
            return this.apiStatus;
        } catch (error) {
            this.apiStatus = false;
            return false;
        }
    }

    async preloadData() {
        if (this.settings.apiToken) {
            try {
                await Promise.all([
                    this.getProjects(),
                    this.getLabels()
                ]);
            } catch (error) {
                console.log('Preload failed, will load on demand');
            }
        }
    }

    startAutoRefresh() {
        this.stopAutoRefresh();
        if (this.settings.autoRefresh && this.settings.refreshInterval > 0) {
            this.refreshInterval = setInterval(async () => {
                await this.refreshCache();
            }, this.settings.refreshInterval * 1000);
        }
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    startSync() {
        this.stopSync();
        if (this.settings.enableSync && this.settings.syncInterval > 0) {
            this.syncInterval = setInterval(async () => {
                await this.syncTasks();
            }, this.settings.syncInterval * 1000);
        }
    }

    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    startConsolidatedRefresh() {
        this.stopConsolidatedRefresh();
        if (this.settings.autoRefreshConsolidated && this.settings.consolidatedRefreshInterval > 0) {
            this.consolidatedRefreshInterval = setInterval(async () => {
                await this.generateConsolidatedNote();
            }, this.settings.consolidatedRefreshInterval * 1000);
        }
    }

    stopConsolidatedRefresh() {
        if (this.consolidatedRefreshInterval) {
            clearInterval(this.consolidatedRefreshInterval);
            this.consolidatedRefreshInterval = null;
        }
    }

    async syncTasks() {
        if (!this.settings.apiToken || this.taskMappings.size === 0) {
            return;
        }

        try {
            for (const [taskId, mapping] of this.taskMappings) {
                const task = await this.getTodoistTask(taskId);
                if (task) {
                    await this.updateTaskInObsidian(task, mapping);
                }
            }
        } catch (error) {
            console.error('Sync error:', error);
        }
    }

    async getTodoistTask(taskId: string): Promise<TodoistTask | null> {
        try {
            const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching task:', error);
        }
        return null;
    }

    async updateTaskInObsidian(task: TodoistTask, mapping: TaskMapping) {
        try {
            const file = this.app.vault.getAbstractFileByPath(mapping.file);
            if (file instanceof TFile) {
                const content = await this.app.vault.read(file);
                const lines = content.split('\n');
                
                if (lines[mapping.line] && lines[mapping.line].includes('#tasktodo')) {
                    const currentLine = lines[mapping.line];
                    const isCurrentlyChecked = currentLine.includes('- [x]');
                    const shouldBeChecked = task.is_completed;
                    
                    if (isCurrentlyChecked !== shouldBeChecked) {
                        if (shouldBeChecked) {
                            lines[mapping.line] = currentLine.replace('- [ ]', '- [x]');
                        } else {
                            lines[mapping.line] = currentLine.replace('- [x]', '- [ ]');
                        }
                        
                        mapping.lineContent = lines[mapping.line];
                        await this.app.vault.modify(file, lines.join('\n'));
                    }
                }
            }
        } catch (error) {
            console.error('Error updating task in Obsidian:', error);
        }
    }

    async handleEditorChange(editor: Editor, view: MarkdownView) {
        try {
            const cursor = editor.getCursor();
            const currentLine = editor.getLine(cursor.line);
            
            const taskMatch = this.findTaskInLine(currentLine);
            if (taskMatch) {
                const { taskId, isCompleted } = taskMatch;
                console.log(`Detected task ${taskId} change to ${isCompleted ? 'completed' : 'uncompleted'}`);
                
                const success = await this.updateTodoistTask(taskId, isCompleted);
                if (success) {
                    const mapping = this.taskMappings.get(taskId);
                    if (mapping) {
                        mapping.lineContent = currentLine;
                        mapping.line = cursor.line;
                        this.saveTaskMappings();
                    }
                }
            }
        } catch (error) {
            console.error('Error handling editor change:', error);
        }
    }

    async handleFileChange(file: TFile) {
        try {
            const content = await this.app.vault.read(file);
            const lines = content.split('\n');
            
            for (const [taskId, mapping] of this.taskMappings) {
                if (mapping.file === file.path && lines[mapping.line]) {
                    const currentLine = lines[mapping.line];
                    
                    if (currentLine !== mapping.lineContent && currentLine.includes('#tasktodo')) {
                        const taskMatch = this.findTaskInLine(currentLine);
                        if (taskMatch && taskMatch.taskId === taskId) {
                            console.log(`File change detected for task ${taskId}: ${taskMatch.isCompleted ? 'completed' : 'uncompleted'}`);
                            
                            const success = await this.updateTodoistTask(taskId, taskMatch.isCompleted);
                            if (success) {
                                mapping.lineContent = currentLine;
                                this.saveTaskMappings();
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error handling file change:', error);
        }
    }

    private findTaskInLine(line: string): { taskId: string; isCompleted: boolean } | null {
        const checkboxMatch = line.match(/- \[([ x])\].*#tasktodo/);
        if (checkboxMatch) {
            const taskIdMatch = line.match(/todoist\.com\/(?:app\/)?(?:task\/)?(\d+)/);
            if (taskIdMatch) {
                return {
                    taskId: taskIdMatch[1],
                    isCompleted: checkboxMatch[1] === 'x'
                };
            }
        }
        return null;
    }

    async updateTodoistTask(taskId: string, isCompleted: boolean): Promise<boolean> {
        try {
            const url = isCompleted 
                ? `https://api.todoist.com/rest/v2/tasks/${taskId}/close`
                : `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`;
                
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });

            if (response.ok) {
                const message = isCompleted ? this.t('taskCompleted') : this.t('taskUncompleted');
                new Notice(message);
                return true;
            } else {
                console.error('Failed to update Todoist task:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error updating Todoist task:', error);
            new Notice(this.t('syncError'));
            return false;
        }
    }

    async loadTaskMappings() {
        try {
            const data = await this.loadData();
            if (data?.taskMappings) {
                this.taskMappings = new Map();
                for (const [taskId, mapping] of Object.entries(data.taskMappings)) {
                    this.taskMappings.set(taskId, mapping as TaskMapping);
                }
            }
        } catch (error) {
            console.error('Error loading task mappings:', error);
        }
    }

    async saveTaskMappings() {
        try {
            const data = await this.loadData() || {};
            data.taskMappings = Object.fromEntries(this.taskMappings);
            await this.saveData(data);
        } catch (error) {
            console.error('Error saving task mappings:', error);
        }
    }

    async refreshCache() {
        this.lastFetch = 0;
        await Promise.all([
            this.getProjects(),
            this.getLabels()
        ]);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        
        if (this.settings.autoRefresh) {
            this.startAutoRefresh();
        } else {
            this.stopAutoRefresh();
        }

        if (this.settings.enableSync) {
            this.startSync();
        } else {
            this.stopSync();
        }

        if (this.settings.autoRefreshConsolidated) {
            this.startConsolidatedRefresh();
        } else {
            this.stopConsolidatedRefresh();
        }

        await this.testApiConnection();
    }

    async createTaskFromText(content: string) {
        if (!this.settings.apiToken) {
            new Notice(this.t('configureApiFirst'));
            return;
        }

        const loadingNotice = new Notice(this.t('creating'), 0);
        
        try {
            const taskData: TaskCreationData = {
                content: content,
                project_id: this.settings.defaultProject,
                priority: 1,
                labels: []
            };

            const task = await this.createTodoistTask(taskData);
            
            loadingNotice.hide();
            
            if (this.settings.insertTaskInNote) {
                await this.insertTaskInCurrentNote(task);
            }
            
            new Notice(`${this.t('taskCreated')}: ${task.content}`);
        } catch (error) {
            loadingNotice.hide();
            new Notice(`${this.t('errorCreatingTask')}: ${error.message}`);
            console.error('Error creating Todoist task:', error);
        }
    }

    async createTodoistTask(taskData: TaskCreationData): Promise<TodoistTask> {
        const url = 'https://api.todoist.com/rest/v2/tasks';
        
        const requestData: any = {
            content: taskData.content,
            priority: taskData.priority
        };

        if (taskData.project_id && taskData.project_id !== '') {
            requestData.project_id = taskData.project_id;
        }

        if (taskData.description && taskData.description.trim() !== '') {
            requestData.description = taskData.description;
        }

        if (taskData.due_string) {
            requestData.due_string = taskData.due_string;
        } else if (taskData.due_datetime) {
            requestData.due_datetime = taskData.due_datetime;
        } else if (taskData.due_date) {
            requestData.due_date = taskData.due_date;
        }

        if (taskData.labels && taskData.labels.length > 0) {
            requestData.labels = taskData.labels;
        }

        if (taskData.duration && taskData.duration_unit) {
            requestData.duration = taskData.duration;
            requestData.duration_unit = taskData.duration_unit;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const task = await response.json();

        if (taskData.reminder && task.id) {
            this.createReminder(task.id, taskData.reminder).catch(console.warn);
        }

        return task;
    }

    async createReminder(taskId: string, reminderTime: string): Promise<void> {
        try {
            const response = await fetch('https://api.todoist.com/rest/v2/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.apiToken}`
                },
                body: JSON.stringify({
                    item_id: taskId,
                    due: { string: reminderTime }
                })
            });

            if (!response.ok) {
                console.warn('Error creating reminder:', response.status);
            }
        } catch (error) {
            console.warn('Error creating reminder:', error);
        }
    }

    async insertTaskInCurrentNote(task: TodoistTask, isRepeat: boolean = false) {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            return;
        }

        const editor = activeView.editor;
        const cursor = editor.getCursor();
        
        const priorityText = this.getPriorityTextWithColor(task.priority);
        const labelsText = task.labels && task.labels.length > 0 ? 
            task.labels.map(label => {
                const labelColor = this.getLabelColor(label);
                return `<span class="todoist-label" style="background-color: ${labelColor}20; border-color: ${labelColor}; color: var(--text-normal);">${label}</span>`;
            }).join(' ') : '';
        const dueText = task.due ? `<span class="todoist-due">${task.due.string}</span>` : '';
        const descText = task.description ? `<span class="todoist-description">${task.description}</span>` : '';
        
        // Usar plantilla diferente para tareas repetitivas
        const template = isRepeat ? this.settings.repeatTaskTemplate || this.settings.taskNoteTemplate : this.settings.taskNoteTemplate;
        
        const taskText = template
            .replace('{{content}}', task.content)
            .replace('{{url}}', task.url)
            .replace('{{id}}', task.id)
            .replace('{{priority}}', priorityText)
            .replace('{{labels}}', labelsText)
            .replace('{{due}}', dueText)
            .replace('{{description}}', descText);
        
        // Determinar el tag apropiado
        const tag = isRepeat ? '#repeattodo' : '#tasktodo';
        const finalText = taskText.includes(tag) ? taskText : `${taskText} ${tag}`;
        
        editor.replaceRange(finalText + '\n', cursor);
        
        if (this.settings.enableSync) {
            const file = activeView.file;
            if (file) {
                this.taskMappings.set(task.id, {
                    todoistId: task.id,
                    file: file.path,
                    line: cursor.line,
                    lineContent: finalText
                });
                this.saveTaskMappings();
                console.log(`Saved mapping for task ${task.id} at line ${cursor.line}`);
            }
        }
        
        const newLine = cursor.line + 1;
        editor.setCursor({ line: newLine, ch: 0 });
    }

    getLabelColor(labelName: string): string {
        const label = this.labelsCache.find(l => l.name === labelName);
        return label?.color || '#808080';
    }

    getPriorityText(priority: number): string {
        switch (priority) {
            case 4: return 'P1';
            case 3: return 'P2';
            case 2: return 'P3';
            case 1: return 'P4';
            default: return 'P4';
        }
    }

    getPriorityTextWithColor(priority: number): string {
        const text = this.getPriorityText(priority);
        const className = `todoist-priority-${text.toLowerCase()}`;
        return `<span class="${className}">${text}</span>`;
    }

    async getProjects(): Promise<TodoistProject[]> {
        if (!this.settings.apiToken) {
            return [];
        }

        const now = Date.now();
        if (this.projectsCache.length > 0 && (now - this.lastFetch) < this.cacheDuration) {
            return this.projectsCache;
        }

        try {
            const response = await fetch('https://api.todoist.com/rest/v2/projects', {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.projectsCache = await response.json();
            this.lastFetch = now;
            return this.projectsCache;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return this.projectsCache;
        }
    }

    async getLabels(): Promise<TodoistLabel[]> {
        if (!this.settings.apiToken) {
            return [];
        }

        const now = Date.now();
        if (this.labelsCache.length > 0 && (now - this.lastFetch) < this.cacheDuration) {
            return this.labelsCache;
        }

        try {
            const response = await fetch('https://api.todoist.com/rest/v2/labels', {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.labelsCache = await response.json();
            return this.labelsCache;
        } catch (error) {
            console.error('Error fetching labels:', error);
            return this.labelsCache;
        }
    }

    async getAllTodoistTasks(): Promise<TodoistTask[]> {
        if (!this.settings.apiToken) {
            return [];
        }

        try {
            const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            return [];
        }
    }

    async generateConsolidatedNote() {
        if (!this.settings.apiToken) {
            new Notice(this.t('configureApiFirst'));
            return;
        }

        if (!this.settings.consolidatedNotePath) {
            new Notice(this.settings.language === 'es' ? 
                'Configura la ruta de la nota consolidada en configuraciones primero' : 
                'Configure consolidated note path in settings first');
            return;
        }

        const loadingNotice = new Notice(
            this.settings.language === 'es' ? 'Generando nota consolidada...' : 'Generating consolidated note...', 
            0
        );

        try {
            // Fetch data in parallel for better performance
            const [tasks, projects, labels] = await Promise.all([
                this.getAllTodoistTasks(),
                this.getProjects(),
                this.getLabels()
            ]);

            // Filter tasks based on settings
            let filteredTasks = tasks.filter(task => !task.is_completed); // Only show incomplete tasks by default

            if (this.settings.consolidatedNoteFilters.projects.length > 0) {
                filteredTasks = filteredTasks.filter(task => 
                    this.settings.consolidatedNoteFilters.projects.includes(task.project_id)
                );
            }

            if (this.settings.consolidatedNoteFilters.labels.length > 0) {
                filteredTasks = filteredTasks.filter(task => 
                    task.labels && task.labels.some(label => 
                        this.settings.consolidatedNoteFilters.labels.includes(label)
                    )
                );
            }

            // Generate note content with better formatting
            let noteContent = `# ${this.settings.language === 'es' ? 'Tareas Consolidadas de Todoist' : 'Consolidated Todoist Tasks'}\n\n`;
            
            if (filteredTasks.length === 0) {
                noteContent += this.settings.language === 'es' ? 
                    'No se encontraron tareas que coincidan con los filtros especificados.\n' :
                    'No tasks found matching the specified filters.\n';
            } else {
                // Group by project with better organization
                const tasksByProject: { [key: string]: TodoistTask[] } = {};
                
                filteredTasks.forEach(task => {
                    const project = projects.find(p => p.id === task.project_id);
                    const projectName = project?.name || (this.settings.language === 'es' ? 'Bandeja de Entrada' : 'Inbox');
                    if (!tasksByProject[projectName]) {
                        tasksByProject[projectName] = [];
                    }
                    tasksByProject[projectName].push(task);
                });

                // Sort projects and generate content
                const sortedProjectNames = Object.keys(tasksByProject).sort();
                let totalTasks = 0;

                sortedProjectNames.forEach(projectName => {
                    const projectTasks = tasksByProject[projectName];
                    totalTasks += projectTasks.length;
                    
                    noteContent += `## ${projectName} (${projectTasks.length})\n\n`;
                    
                    // Sort tasks by priority and due date
                    projectTasks.sort((a, b) => {
                        if (a.priority !== b.priority) {
                            return b.priority - a.priority; // Higher priority first
                        }
                        if (a.due?.date && b.due?.date) {
                            return new Date(a.due.date).getTime() - new Date(b.due.date).getTime();
                        }
                        return 0;
                    });
                    
                    projectTasks.forEach(task => {
                        const checkbox = task.is_completed ? '[x]' : '[ ]';
                        const priorityText = this.getPriorityText(task.priority);
                        const labelsText = task.labels && task.labels.length > 0 ? 
                            task.labels.map(label => `#${label.replace(/\s+/g, '-')}`).join(' ') : '';
                        const dueText = task.due ? ` 📅 ${task.due.string}` : '';
                        const urlText = `[📋](${task.url})`;
                        
                        noteContent += `- ${checkbox} **${task.content}** ${urlText} ${priorityText}`;
                        if (labelsText) noteContent += ` ${labelsText}`;
                        if (dueText) noteContent += `${dueText}`;
                        if (task.description) {
                            noteContent += `\n  - *${task.description}*`;
                        }
                        noteContent += '\n';
                    });
                    
                    noteContent += '\n';
                });

                // Add summary
                noteContent += `---\n\n**${this.settings.language === 'es' ? 'Resumen' : 'Summary'}**: ${totalTasks} ${this.settings.language === 'es' ? 'tareas en' : 'tasks across'} ${sortedProjectNames.length} ${this.settings.language === 'es' ? 'proyectos' : 'projects'}\n`;
            }

            // Ensure the directory exists
            const notePath = this.settings.consolidatedNotePath.endsWith('.md') ? 
                this.settings.consolidatedNotePath : `${this.settings.consolidatedNotePath}.md`;
            
            const pathParts = notePath.split('/');
            if (pathParts.length > 1) {
                const dirPath = pathParts.slice(0, -1).join('/');
                if (!this.app.vault.getAbstractFileByPath(dirPath)) {
                    await this.app.vault.createFolder(dirPath);
                }
            }
            
            const file = this.app.vault.getAbstractFileByPath(notePath);
            
            if (file instanceof TFile) {
                await this.app.vault.modify(file, noteContent);
            } else {
                await this.app.vault.create(notePath, noteContent);
            }

            loadingNotice.hide();
            new Notice(this.t('consolidatedNoteGenerated'));
            
            // Open the note
            const createdFile = this.app.vault.getAbstractFileByPath(notePath);
            if (createdFile instanceof TFile) {
                this.app.workspace.getLeaf().openFile(createdFile);
            }
            
        } catch (error) {
            loadingNotice.hide();
            const errorMessage = this.settings.language === 'es' ? 
                `Error generando nota consolidada: ${error.message}` :
                `Error generating consolidated note: ${error.message}`;
            new Notice(errorMessage);
            console.error('Error generating consolidated note:', error);
        }
    }
}

class ApiTokenModal extends Modal {
    plugin: TodoistPlugin;
    tokenInput: HTMLInputElement;
    statusIndicator: HTMLElement;

    constructor(app: App, plugin: TodoistPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: this.plugin.t('tokenModalTitle') });

        const statusContainer = contentEl.createDiv({ cls: 'api-status-container' });
        statusContainer.createEl('span', { text: this.plugin.t('apiStatus') + ': ' });
        this.statusIndicator = statusContainer.createEl('span', { 
            cls: this.plugin.apiStatus ? 'api-status-connected' : 'api-status-disconnected',
            text: this.plugin.apiStatus ? this.plugin.t('apiConnected') : this.plugin.t('apiDisconnected')
        });

        const descEl = contentEl.createEl('p', { text: this.plugin.t('tokenModalDesc') });
        descEl.style.marginBottom = '20px';
        descEl.style.color = 'var(--text-muted)';

        const linkEl = contentEl.createEl('a', { 
            text: this.plugin.t('getTokenLink'),
            href: 'https://todoist.com/prefs/integrations'
        });
        linkEl.style.marginBottom = '15px';
        linkEl.style.display = 'block';
        linkEl.target = '_blank';

        const tokenContainer = contentEl.createDiv();
        tokenContainer.style.marginBottom = '20px';

        this.tokenInput = tokenContainer.createEl('input', {
            type: 'password',
            placeholder: this.plugin.t('tokenPlaceholder')
        });
        this.tokenInput.style.width = '100%';
        this.tokenInput.style.padding = '10px';
        this.tokenInput.style.border = '1px solid var(--background-modifier-border)';
        this.tokenInput.style.borderRadius = '4px';
        this.tokenInput.style.background = 'var(--background-primary)';
        this.tokenInput.style.color = 'var(--text-normal)';
        this.tokenInput.value = this.plugin.settings.apiToken;

        const buttonContainer = contentEl.createDiv();
        buttonContainer.style.textAlign = 'right';

        const testButton = buttonContainer.createEl('button', { text: this.plugin.t('testConnection') });
        testButton.style.marginRight = '10px';
        testButton.addEventListener('click', () => this.testConnection());

        const cancelButton = buttonContainer.createEl('button', { text: this.plugin.t('cancel') });
        cancelButton.style.marginRight = '10px';
        cancelButton.addEventListener('click', () => this.close());

        const saveButton = buttonContainer.createEl('button', { text: this.plugin.t('save') });
        saveButton.addClass('mod-cta');
        saveButton.addEventListener('click', () => this.saveToken());

        setTimeout(() => this.tokenInput.focus(), 100);

        this.tokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveToken();
            }
        });
    }

    async testConnection() {
        const token = this.tokenInput.value.trim();
        if (!token) return;

        const originalToken = this.plugin.settings.apiToken;
        this.plugin.settings.apiToken = token;
        
        const isConnected = await this.plugin.testApiConnection();
        
        this.statusIndicator.className = isConnected ? 'api-status-connected' : 'api-status-disconnected';
        this.statusIndicator.textContent = isConnected ? this.plugin.t('apiConnected') : this.plugin.t('apiDisconnected');
        
        if (!isConnected) {
            this.plugin.settings.apiToken = originalToken;
        }
    }

    async saveToken() {
        const token = this.tokenInput.value.trim();
        if (token) {
            this.plugin.settings.apiToken = token;
            await this.plugin.saveSettings();
            new Notice(this.plugin.t('tokenSaved'));
            this.close();
            this.plugin.refreshCache();
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class DatePickerModal extends Modal {
    plugin: TodoistPlugin;
    onDateSelect: (date: string, repeat?: string, duration?: number) => void;
    selectedRepeat: string = '';
    selectedDuration: number = 0;

    constructor(app: App, plugin: TodoistPlugin, onDateSelect: (date: string, repeat?: string, duration?: number) => void) {
        super(app);
        this.plugin = plugin;
        this.onDateSelect = onDateSelect;
        this.selectedDuration = 0;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('deadline'), cls: 'modal-title' });

        const quickOptions = contentEl.createDiv({ cls: 'date-quick-options' });
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
        
        const nextWeekEnd = new Date(thisWeekEnd);
        nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

        const quickDates = [
            { label: this.plugin.t('today'), value: this.formatDate(today) },
            { label: this.plugin.t('tomorrow'), value: this.formatDate(tomorrow) },
            { label: this.plugin.t('thisWeek'), value: this.formatDate(thisWeekEnd) },
            { label: this.plugin.t('nextWeek'), value: this.formatDate(nextWeekEnd) }
        ];

        quickDates.forEach(dateOption => {
            const button = quickOptions.createEl('button', { 
                text: dateOption.label,
                cls: 'date-quick-button'
            });
            button.addEventListener('click', () => {
                this.onDateSelect(dateOption.value, this.selectedRepeat);
                this.close();
            });
        });

        contentEl.createEl('hr', { cls: 'date-separator' });
        
        const optionsContainer = contentEl.createDiv({ cls: 'date-options-container' });
        
        const repeatSelect = optionsContainer.createEl('select', { cls: 'unified-select repeat-select' });
        
        const repeatOptions = [
            { value: '', key: 'noRepeat', icon: '❌' },
            { value: 'every day', key: 'daily', icon: '📅' },
            { value: 'every week', key: 'weekly', icon: '📆' },
            { value: 'every weekday', key: 'weekdays', icon: '💼' },
            { value: 'every month', key: 'monthly', icon: '📅' },
            { value: 'every year', key: 'yearly', icon: '🎆' }
        ];
        
        repeatOptions.forEach(option => {
            const optionElement = repeatSelect.createEl('option', { text: this.plugin.t(option.key) });
            optionElement.value = option.value;
        });
        
        repeatSelect.addEventListener('change', (e) => {
            this.selectedRepeat = (e.target as HTMLSelectElement).value;
        });
        
        // Selector de duración opcional en la misma fila
        const durationSelect = optionsContainer.createEl('select', { cls: 'unified-select duration-select' });
        
        const durationOptions = [
            { value: 0, key: 'noDuration', icon: '❌' },
            { value: 15, key: '15min', icon: '⏱️' },
            { value: 30, key: '30min', icon: '⏱️' },
            { value: 45, key: '45min', icon: '⏱️' },
            { value: 60, key: '1hour', icon: '⏰' },
            { value: 90, key: '1hour30min', icon: '⏰' },
            { value: 120, key: '2hours', icon: '⏰' },
            { value: 180, key: '3hours', icon: '⏰' },
            { value: 240, key: '4hours', icon: '⏰' },
            { value: 300, key: '5hours', icon: '⏰' },
            { value: 360, key: '6hours', icon: '⏰' },
            { value: 420, key: '7hours', icon: '⏰' },
            { value: 480, key: '8hours', icon: '⏰' }
        ];
        
        durationOptions.forEach(option => {
            const text = option.value === 0 ? this.plugin.t('noDuration') : this.plugin.t(option.key);
            const optionElement = durationSelect.createEl('option', { text: text });
            optionElement.value = option.value.toString();
        });
        
        durationSelect.addEventListener('change', (e) => {
            this.selectedDuration = parseInt((e.target as HTMLSelectElement).value);
        });
        
        contentEl.createEl('p', { 
            text: this.plugin.t('customDate'),
            cls: 'date-custom-label'
        });

        const now = new Date();
        this.renderCalendar(contentEl, now.getMonth(), now.getFullYear());
    }

    formatDate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    renderCalendar(container: HTMLElement, month: number, year: number) {
        const existingCalendar = container.querySelector('.calendar-container');
        if (existingCalendar) {
            existingCalendar.remove();
        }

        const calendarContainer = container.createDiv({ cls: 'calendar-container' });
        const headerEl = calendarContainer.createDiv({ cls: 'calendar-header' });

        const prevButton = headerEl.createEl('button', { text: '‹', cls: 'calendar-nav-button' });
        const monthYearEl = headerEl.createEl('span', { 
            text: new Date(year, month).toLocaleDateString(this.plugin.settings.language === 'es' ? 'es' : 'en', { 
                month: 'long', year: 'numeric' 
            }),
            cls: 'calendar-month-year'
        });
        const nextButton = headerEl.createEl('button', { text: '›', cls: 'calendar-nav-button' });

        prevButton.addEventListener('click', () => {
            const newDate = new Date(year, month - 1);
            this.renderCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });

        nextButton.addEventListener('click', () => {
            const newDate = new Date(year, month + 1);
            this.renderCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });

        const calendarEl = calendarContainer.createDiv({ cls: 'calendar-grid' });

        const daysOfWeek = this.plugin.settings.language === 'es' 
            ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
        daysOfWeek.forEach(day => {
            calendarEl.createEl('div', { text: day, cls: 'calendar-day-header' });
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            calendarEl.createDiv({ cls: 'calendar-day-empty' });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = calendarEl.createEl('div', { text: day.toString(), cls: 'calendar-day' });
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === today.toDateString();
            
            if (isToday) {
                dayEl.addClass('calendar-day-today');
            }
            
            if (currentDate < today) {
                dayEl.addClass('calendar-day-past');
            }

            dayEl.addEventListener('click', () => {
                this.onDateSelect(this.formatDate(currentDate), this.selectedRepeat, this.selectedDuration);
                this.close();
            });
        }

        const cancelButton = calendarContainer.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'calendar-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class TimePickerModal extends Modal {
    plugin: TodoistPlugin;
    onTimeSelect: (time: string) => void;

    constructor(app: App, plugin: TodoistPlugin, onTimeSelect: (time: string) => void) {
        super(app);
        this.plugin = plugin;
        this.onTimeSelect = onTimeSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('selectTime'), cls: 'modal-title' });

        const timeContainer = contentEl.createDiv({ cls: 'time-container' });
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = Math.floor(currentTime.getMinutes() / 15) * 15;

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                const displayTime = new Date(0, 0, 0, hour, minute).toLocaleTimeString(
                    this.plugin.settings.language === 'es' ? 'es' : 'en', 
                    { hour: '2-digit', minute: '2-digit', hour12: false }
                );

                const timeEl = timeContainer.createEl('div', { text: displayTime, cls: 'time-option' });

                if (hour === currentHour && minute === currentMinute) {
                    timeEl.addClass('time-option-current');
                    setTimeout(() => timeEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }

                timeEl.addEventListener('click', () => {
                    this.onTimeSelect(timeString);
                    this.close();
                });
            }
        }

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'time-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class ReminderPickerModal extends Modal {
    plugin: TodoistPlugin;
    onReminderSelect: (reminder: string) => void;

    constructor(app: App, plugin: TodoistPlugin, onReminderSelect: (reminder: string) => void) {
        super(app);
        this.plugin = plugin;
        this.onReminderSelect = onReminderSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('reminder'), cls: 'modal-title' });

        const reminderContainer = contentEl.createDiv({ cls: 'reminder-container' });

        const reminderOptions = [
            { value: '', key: 'noReminder' },
            { value: '5 minutes before', key: '5minBefore' },
            { value: '15 minutes before', key: '15minBefore' },
            { value: '30 minutes before', key: '30minBefore' },
            { value: '1 hour before', key: '1hourBefore' },
            { value: '2 hours before', key: '2hoursBefore' },
            { value: '1 day before', key: '1dayBefore' }
        ];

        reminderOptions.forEach(option => {
            const reminderEl = reminderContainer.createEl('div', { 
                text: this.plugin.t(option.key),
                cls: 'reminder-option'
            });

            reminderEl.addEventListener('click', () => {
                this.onReminderSelect(option.value);
                this.close();
            });
        });

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'reminder-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class RepeatPickerModal extends Modal {
    plugin: TodoistPlugin;
    onRepeatSelect: (repeat: string) => void;
    currentRepeat: string;

    constructor(app: App, plugin: TodoistPlugin, currentRepeat: string, onRepeatSelect: (repeat: string) => void) {
        super(app);
        this.plugin = plugin;
        this.currentRepeat = currentRepeat;
        this.onRepeatSelect = onRepeatSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('repeat'), cls: 'modal-title' });

        const repeatContainer = contentEl.createDiv({ cls: 'repeat-options-container' });

        const repeatOptions = [
            { value: '', key: 'noRepeat' },
            { value: 'every day', key: 'daily' },
            { value: 'every week', key: 'weekly' },
            { value: 'every weekday', key: 'weekdays' },
            { value: 'every month', key: 'monthly' },
            { value: 'every year', key: 'yearly' }
        ];

        repeatOptions.forEach(option => {
            const optionEl = repeatContainer.createEl('div', { 
                text: this.plugin.t(option.key),
                cls: 'repeat-option'
            });
            
            if (option.value === this.currentRepeat) {
                optionEl.addClass('selected');
            }

            optionEl.addEventListener('click', () => {
                this.onRepeatSelect(option.value);
                this.close();
            });
        });

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'repeat-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class ProjectPickerModal extends Modal {
    plugin: TodoistPlugin;
    projects: TodoistProject[];
    onProjectSelect: (projectId: string) => void;
    currentProject: string;

    constructor(app: App, plugin: TodoistPlugin, projects: TodoistProject[], currentProject: string, onProjectSelect: (projectId: string) => void) {
        super(app);
        this.plugin = plugin;
        this.projects = projects;
        this.currentProject = currentProject;
        this.onProjectSelect = onProjectSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('project'), cls: 'modal-title' });

        const projectContainer = contentEl.createDiv({ cls: 'project-options-container' });

        // Opción de Inbox
        const inboxOption = projectContainer.createEl('div', { 
            text: this.plugin.t('inbox'),
            cls: 'project-option'
        });
        
        if (!this.currentProject) {
            inboxOption.addClass('selected');
        }

        inboxOption.addEventListener('click', () => {
            this.onProjectSelect('');
            this.close();
        });

        // Proyectos del usuario
        this.projects.forEach(project => {
            const projectOption = projectContainer.createEl('div', { 
                text: project.name,
                cls: 'project-option'
            });
            
            if (project.id === this.currentProject) {
                projectOption.addClass('selected');
            }

            projectOption.addEventListener('click', () => {
                this.onProjectSelect(project.id);
                this.close();
            });
        });

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'project-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class PriorityPickerModal extends Modal {
    plugin: TodoistPlugin;
    onPrioritySelect: (priority: number) => void;
    currentPriority: number;

    constructor(app: App, plugin: TodoistPlugin, currentPriority: number, onPrioritySelect: (priority: number) => void) {
        super(app);
        this.plugin = plugin;
        this.currentPriority = currentPriority;
        this.onPrioritySelect = onPrioritySelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('priority'), cls: 'modal-title' });

        const priorityContainer = contentEl.createDiv({ cls: 'priority-options-container' });

        const priorities = [
            { value: 4, key: 'p1Urgent' },
            { value: 3, key: 'p2High' },
            { value: 2, key: 'p3Medium' },
            { value: 1, key: 'p4Low' }
        ];

        priorities.forEach(priority => {
            const priorityOption = priorityContainer.createEl('div', { 
                text: this.plugin.t(priority.key),
                cls: 'priority-option'
            });
            
            if (priority.value === this.currentPriority) {
                priorityOption.addClass('selected');
            }

            priorityOption.addEventListener('click', () => {
                this.onPrioritySelect(priority.value);
                this.close();
            });
        });

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'priority-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class DurationPickerModal extends Modal {
    plugin: TodoistPlugin;
    onDurationSelect: (duration: number) => void;

    constructor(app: App, plugin: TodoistPlugin, onDurationSelect: (duration: number) => void) {
        super(app);
        this.plugin = plugin;
        this.onDurationSelect = onDurationSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('selectDuration'), cls: 'modal-title' });

        const durationContainer = contentEl.createDiv({ cls: 'duration-container' });

        const durations = [
            { minutes: 15, key: '15min' },
            { minutes: 30, key: '30min' },
            { minutes: 45, key: '45min' },
            { minutes: 60, key: '1hour' },
            { minutes: 90, key: '1hour30min' },
            { minutes: 120, key: '2hours' },
            { minutes: 150, key: '2hours30min' },
            { minutes: 180, key: '3hours' },
            { minutes: 240, key: '4hours' },
            { minutes: 300, key: '5hours' },
            { minutes: 360, key: '6hours' },
            { minutes: 420, key: '7hours' },
            { minutes: 480, key: '8hours' }
        ];

        durations.forEach(duration => {
            const durationEl = durationContainer.createEl('div', { 
                text: this.plugin.t(duration.key),
                cls: 'duration-option'
            });

            durationEl.addEventListener('click', () => {
                this.onDurationSelect(duration.minutes);
                this.close();
            });
        });

        const cancelButton = contentEl.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'duration-cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class CreateTaskModal extends Modal {
    plugin: TodoistPlugin;
    taskContent: string = '';
    taskDescription: string = '';
    selectedProject: string;
    selectedPriority: number = 1;
    selectedLabels: string[] = [];
    dueDate: string = '';
    dueTime: string = '';
    taskDuration: number = 0;
    reminderTime: string = '';
    repeatOption: string = '';
    projects: TodoistProject[] = [];
    labels: TodoistLabel[] = [];
    dueDateButton: HTMLButtonElement;
    dueDateLimitButton: HTMLButtonElement;
    dueTimeButton: HTMLButtonElement;
    durationButton: HTMLButtonElement;
    reminderButton: HTMLButtonElement;
    labelsButton: HTMLButtonElement;
    createButton: HTMLButtonElement;

    constructor(app: App, plugin: TodoistPlugin) {
        super(app);
        this.plugin = plugin;
        this.selectedProject = plugin.settings.defaultProject;
        this.dueTime = plugin.settings.defaultTime;
        this.taskDuration = plugin.settings.defaultDuration;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.addClass('todoist-modal');
        contentEl.createEl('h2', { text: this.plugin.t('createTask'), cls: 'modal-title' });

        const [projects, labels] = await Promise.all([
            this.plugin.getProjects(),
            this.plugin.getLabels()
        ]);
        
        this.projects = projects;
        this.labels = labels;

        this.createTaskContentField(contentEl);
        this.createDescriptionField(contentEl);
        this.createUnifiedSelectors(contentEl);
        this.createDueDateFields(contentEl);
        this.createInsertCheckbox(contentEl);
        this.createButtons(contentEl);
    }

    createTaskContentField(contentEl: HTMLElement) {
        const taskContentContainer = contentEl.createDiv({ cls: 'field-container' });
        taskContentContainer.createEl('label', { text: this.plugin.t('taskContent') + ' *', cls: 'field-label' });
        const taskInput = taskContentContainer.createEl('input', {
            type: 'text',
            placeholder: this.plugin.t('taskContentPlaceholder'),
            cls: 'task-input'
        });
        taskInput.addEventListener('input', (e) => {
            this.taskContent = (e.target as HTMLInputElement).value;
        });
        
        setTimeout(() => taskInput.focus(), 100);
    }

    createDescriptionField(contentEl: HTMLElement) {
        const descContainer = contentEl.createDiv({ cls: 'field-container' });
        descContainer.createEl('label', { text: this.plugin.t('description'), cls: 'field-label' });
        
        const descTextarea = descContainer.createEl('textarea', {
            placeholder: this.plugin.t('descriptionPlaceholder'),
            cls: 'description-textarea'
        });
        descTextarea.addEventListener('input', (e) => {
            this.taskDescription = (e.target as HTMLTextAreaElement).value;
        });
    }

    createUnifiedSelectors(contentEl: HTMLElement) {
        const unifiedContainer = contentEl.createDiv({ cls: 'unified-selectors-container' });
        
        // Proyecto como dropdown unificado
        if (this.projects.length > 0) {
            const projectSelect = unifiedContainer.createEl('select', { 
                cls: 'unified-select project-select'
            });
            
            const defaultOption = projectSelect.createEl('option', { text: this.plugin.t('project') });
            defaultOption.value = '';
            
            this.projects.forEach(project => {
                const option = projectSelect.createEl('option', { text: project.name });
                option.value = project.id;
                if (project.id === this.selectedProject) {
                    option.selected = true;
                }
            });
            
            projectSelect.addEventListener('change', (e) => {
                this.selectedProject = (e.target as HTMLSelectElement).value;
            });
        }

        // Prioridad como dropdown unificado con banderas material
        const prioritySelect = unifiedContainer.createEl('select', { 
            cls: 'unified-select priority-select'
        });
        
        const priorities = [
            { value: 4, key: 'p1Urgent', color: '#d1453b' },
            { value: 3, key: 'p2High', color: '#eb8909' },
            { value: 2, key: 'p3Medium', color: '#246fe0' },
            { value: 1, key: 'p4Low', color: '#666666' }
        ];
        
        priorities.forEach(priority => {
            const option = prioritySelect.createEl('option', { text: this.plugin.t(priority.key) });
            option.value = priority.value.toString();
            option.className = `priority-option-p${priority.value}`;
            option.style.color = priority.color;
            option.setAttribute('data-priority-color', priority.color);
            if (priority.value === this.selectedPriority) {
                option.selected = true;
            }
        });
        
        prioritySelect.addEventListener('change', (e) => {
            this.selectedPriority = parseInt((e.target as HTMLSelectElement).value);
        });

        // Recordatorio como dropdown unificado
        const reminderSelect = unifiedContainer.createEl('select', {
            cls: 'unified-select reminder-select'
        });
        
        const reminderOptions = [
            { value: '', key: 'reminder' },
            { value: '5min', key: '5minBefore' },
            { value: '15min', key: '15minBefore' },
            { value: '30min', key: '30minBefore' },
            { value: '1hour', key: '1hourBefore' },
            { value: '2hours', key: '2hoursBefore' },
            { value: '1day', key: '1dayBefore' }
        ];
        
        reminderOptions.forEach(option => {
            const optionEl = reminderSelect.createEl('option', { text: this.plugin.t(option.key) });
            optionEl.value = option.value;
            if (option.value === this.reminderTime) {
                optionEl.selected = true;
            }
        });
        
        reminderSelect.addEventListener('change', (e) => {
            this.reminderTime = (e.target as HTMLSelectElement).value;
        });

        // Etiquetas como botón desplegable
        if (this.labels.length > 0) {
            this.labelsButton = unifiedContainer.createEl('button', {
                cls: 'unified-button labels-button'
            });
            
            this.updateLabelsDisplay();
            
            this.labelsButton.addEventListener('click', () => {
                new LabelsPickerModal(this.app, this.plugin, this.labels, this.selectedLabels, (selectedLabels) => {
                    this.selectedLabels = selectedLabels;
                    this.updateLabelsDisplay();
                }).open();
            });
        }
    }

    createDueDateFields(contentEl: HTMLElement) {
        const dateFieldsContainer = contentEl.createDiv({ cls: 'date-fields-container' });
        
        // Campo Fecha (sin label)
        this.dueDateButton = dateFieldsContainer.createEl('button', { 
            text: this.dueDate || this.plugin.t('selectDate'),
            cls: 'unified-button date-button'
        });
        this.dueDateButton.addEventListener('click', () => {
            new DatePickerModal(this.app, this.plugin, (selectedDate, repeat, duration) => {
                this.dueDate = selectedDate;
                this.repeatOption = repeat || '';
                this.taskDuration = duration || 0;
                this.dueDateButton.setText(selectedDate);
            }).open();
        });

        // Campo Fecha Límite (sin label) - SIEMPRE PRESENTE
        this.dueDateLimitButton = dateFieldsContainer.createEl('button', { 
            text: this.plugin.t('deadline'),
            cls: 'unified-button due-date-button'
        });
        this.dueDateLimitButton.addEventListener('click', () => {
            new DatePickerModal(this.app, this.plugin, (selectedDate, repeat, duration) => {
                this.dueDate = selectedDate;
                this.repeatOption = repeat || '';
                this.taskDuration = duration || 0;
                this.dueDateLimitButton.setText(selectedDate);
            }).open();
        });

        // Campo de Tiempo como dropdown (solo si está habilitado)
        if (this.plugin.settings.enableTimeSelection) {
            const timeContainer = contentEl.createDiv({ cls: 'field-container' });
            
            const timeSelect = timeContainer.createEl('select', { 
                cls: 'unified-select time-select'
            });
            
            // Generar opciones de tiempo cada 15 minutos
            const defaultTimeOption = timeSelect.createEl('option', { text: this.plugin.t('selectTime') });
            defaultTimeOption.value = '';
            
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const option = timeSelect.createEl('option', { text: timeStr });
                    option.value = timeStr;
                    if (timeStr === this.dueTime) {
                        option.selected = true;
                    }
                }
            }
            
            timeSelect.addEventListener('change', (e) => {
                this.dueTime = (e.target as HTMLSelectElement).value;
            });
        } else {
            // Reset time if time selection is disabled
            this.dueTime = '';
        }
    }

    formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes}min`;
        } else if (minutes % 60 === 0) {
            return `${minutes / 60}h`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h ${mins}min`;
        }
    }

    createInsertCheckbox(contentEl: HTMLElement) {
        // Campo de Insertar en Nota (sin label)
        const insertContainer = contentEl.createDiv({ cls: 'insert-field-container' });
        
        const checkboxContainer = insertContainer.createDiv({ cls: 'inline-checkbox-container' });
        
        const insertCheckbox = checkboxContainer.createEl('input', { 
            type: 'checkbox',
            attr: { id: 'insert-task-checkbox' }
        });
        insertCheckbox.checked = this.plugin.settings.insertTaskInNote;
        insertCheckbox.addEventListener('change', (e) => {
            this.plugin.settings.insertTaskInNote = (e.target as HTMLInputElement).checked;
            this.plugin.saveSettings();
        });
        
        checkboxContainer.createEl('label', { 
            text: this.plugin.t('insertInNote'),
            cls: 'checkbox-label',
            attr: { for: 'insert-task-checkbox' }
        });
    }

    updateLabelsDisplay() {
        if (!this.labelsButton) return;
        
        if (this.selectedLabels.length === 0) {
            this.labelsButton.setText(this.plugin.t('labels'));
        } else {
            const labelText = this.selectedLabels.length === 1 
                ? this.selectedLabels[0] 
                : `${this.selectedLabels.length} ${this.plugin.t('labels')}`;
            this.labelsButton.setText(labelText);
        }
    }

    getSelectedProjectName(): string {
        if (!this.selectedProject) return '';
        const project = this.projects.find(p => p.id === this.selectedProject);
        return project ? project.name : '';
    }

    getSelectedPriorityName(): string {
        const priorities = [
            { value: 4, key: 'p1Urgent' },
            { value: 3, key: 'p2High' },
            { value: 2, key: 'p3Medium' },
            { value: 1, key: 'p4Low' }
        ];
        const priority = priorities.find(p => p.value === this.selectedPriority);
        return priority ? this.plugin.t(priority.key) : this.plugin.t('p4Low');
    }

    createReminderField(contentEl: HTMLElement) {
        // Este método ahora está integrado en createReminderLabelsInsert
    }

    createInsertNoteCheckbox(contentEl: HTMLElement) {
        // Este método ahora está integrado en createReminderLabelsInsert
    }

    createButtons(contentEl: HTMLElement) {
        const buttonContainer = contentEl.createDiv({ cls: 'button-container' });

        const cancelButton = buttonContainer.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'cancel-button'
        });
        cancelButton.addEventListener('click', () => {
            this.close();
        });

        this.createButton = buttonContainer.createEl('button', { 
            text: this.plugin.t('createTaskBtn'),
            cls: 'create-button'
        });
        this.createButton.addEventListener('click', async () => {
            await this.createTask();
        });
    }

    async createTask() {
        if (!this.taskContent.trim()) {
            new Notice(this.plugin.t('enterTaskContent'));
            return;
        }
        
        this.createButton.disabled = true;
        this.createButton.setText(this.plugin.t('creating'));
        
        try {
            const taskData: TaskCreationData = {
                content: this.taskContent,
                description: this.taskDescription,
                project_id: this.selectedProject,
                priority: this.selectedPriority,
                labels: this.selectedLabels,
                reminder: this.reminderTime
            };

            if (this.dueDate) {
                let dueString = this.dueDate;
                
                // Only add time if time selection is enabled and time is set
                if (this.plugin.settings.enableTimeSelection && this.dueTime) {
                    dueString += ` at ${this.dueTime}`;
                }
                
                if (this.repeatOption && this.repeatOption.trim() !== '') {
                    dueString += ` ${this.repeatOption}`;
                }
                
                taskData.due_string = dueString;
            }

            if (this.taskDuration > 0) {
                taskData.duration = this.taskDuration;
                taskData.duration_unit = 'minute';
            }

            const task = await this.plugin.createTodoistTask(taskData);
            
            if (this.plugin.settings.insertTaskInNote) {
                const isRepeatTask = !!(this.repeatOption && this.repeatOption.trim() !== '');
                await this.plugin.insertTaskInCurrentNote(task, isRepeatTask);
            }
            
            new Notice(`${this.plugin.t('taskCreated')}: ${task.content}`);
            this.close();
        } catch (error) {
            new Notice(`${this.plugin.t('errorCreatingTask')}: ${error.message}`);
            console.error('Error creating task:', error);
            
            this.createButton.disabled = false;
            this.createButton.setText(this.plugin.t('createTaskBtn'));
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class LabelsPickerModal extends Modal {
    plugin: TodoistPlugin;
    labels: TodoistLabel[];
    selectedLabels: string[];
    onLabelsSelect: (labels: string[]) => void;
    private tempSelectedLabels: string[];

    constructor(app: App, plugin: TodoistPlugin, labels: TodoistLabel[], selectedLabels: string[], onLabelsSelect: (labels: string[]) => void) {
        super(app);
        this.plugin = plugin;
        this.labels = labels;
        this.selectedLabels = selectedLabels;
        this.onLabelsSelect = onLabelsSelect;
        this.tempSelectedLabels = [...selectedLabels];
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this.plugin.t('labels'), cls: 'modal-title' });

        const labelsContainer = contentEl.createDiv({ cls: 'labels-picker-container' });

        this.labels.forEach(label => {
            const labelButton = labelsContainer.createEl('button', {
                text: label.name,
                cls: 'label-picker-button'
            });

            labelButton.style.borderColor = label.color || '#ccc';
            labelButton.style.backgroundColor = this.tempSelectedLabels.includes(label.name) 
                ? `${label.color}20` 
                : 'transparent';

            if (this.tempSelectedLabels.includes(label.name)) {
                labelButton.addClass('selected');
            }

            labelButton.addEventListener('click', () => {
                if (this.tempSelectedLabels.includes(label.name)) {
                    this.tempSelectedLabels = this.tempSelectedLabels.filter(l => l !== label.name);
                    labelButton.removeClass('selected');
                    labelButton.style.backgroundColor = 'transparent';
                } else {
                    this.tempSelectedLabels.push(label.name);
                    labelButton.addClass('selected');
                    labelButton.style.backgroundColor = `${label.color}20`;
                }
            });
        });

        const buttonContainer = contentEl.createDiv({ cls: 'button-container' });

        const cancelButton = buttonContainer.createEl('button', { 
            text: this.plugin.t('cancel'),
            cls: 'cancel-button'
        });
        cancelButton.addEventListener('click', () => this.close());

        const saveButton = buttonContainer.createEl('button', { 
            text: this.plugin.t('save'),
            cls: 'create-button'
        });
        saveButton.addEventListener('click', () => {
            this.onLabelsSelect(this.tempSelectedLabels);
            this.close();
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class TodoistSettingTab extends PluginSettingTab {
    plugin: TodoistPlugin;

    constructor(app: App, plugin: TodoistPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: this.plugin.t('settingsTitle') });

        const apiSetting = new Setting(containerEl)
            .setName(this.plugin.t('apiToken'))
            .setDesc(this.plugin.t('apiTokenDesc'));

        const apiContainer = apiSetting.controlEl.createDiv({ cls: 'api-setting-container' });
        
        const configButton = apiContainer.createEl('button', { text: this.plugin.t('configureToken') });
        configButton.addEventListener('click', () => {
            new ApiTokenModal(this.app, this.plugin).open();
        });

        const statusIndicator = apiContainer.createEl('span', { 
            cls: this.plugin.apiStatus ? 'api-status-connected' : 'api-status-disconnected',
            text: this.plugin.apiStatus ? ' ✓ ' + this.plugin.t('apiConnected') : ' ✗ ' + this.plugin.t('apiDisconnected')
        });

        new Setting(containerEl)
            .setName(this.plugin.t('language'))
            .setDesc(this.plugin.t('languageDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('es', 'Español')
                .addOption('en', 'English')
                .setValue(this.plugin.settings.language)
                .onChange(async (value: 'en' | 'es') => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('enableSync'))
            .setDesc(this.plugin.t('enableSyncDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSync)
                .onChange(async (value) => {
                    this.plugin.settings.enableSync = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.enableSync) {
            new Setting(containerEl)
                .setName(this.plugin.t('syncInterval'))
                .setDesc(this.plugin.t('syncIntervalDesc'))
                .addSlider(slider => slider
                    .setLimits(30, 300, 30)
                    .setValue(this.plugin.settings.syncInterval)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.syncInterval = value;
                        await this.plugin.saveSettings();
                    }));
        }

        new Setting(containerEl)
            .setName(this.plugin.t('defaultTime'))
            .setDesc(this.plugin.t('defaultTimeDesc'))
            .addText(text => text
                .setPlaceholder('08:00')
                .setValue(this.plugin.settings.defaultTime)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTime = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('defaultDuration'))
            .setDesc(this.plugin.t('defaultDurationDesc'))
            .addSlider(slider => slider
                .setLimits(15, 480, 15)
                .setValue(this.plugin.settings.defaultDuration)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.defaultDuration = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('autoRefresh'))
            .setDesc(this.plugin.t('autoRefreshDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoRefresh)
                .onChange(async (value) => {
                    this.plugin.settings.autoRefresh = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.autoRefresh) {
            new Setting(containerEl)
                .setName(this.plugin.t('refreshInterval'))
                .setDesc(this.plugin.t('refreshIntervalDesc'))
                .addSlider(slider => slider
                    .setLimits(30, 3600, 30)
                    .setValue(this.plugin.settings.refreshInterval)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.refreshInterval = value;
                        await this.plugin.saveSettings();
                    }));
        }

        new Setting(containerEl)
            .setName(this.plugin.t('defaultProject'))
            .setDesc(this.plugin.t('defaultProjectDesc'))
            .addText(text => text
                .setPlaceholder('ID del proyecto')
                .setValue(this.plugin.settings.defaultProject)
                .onChange(async (value) => {
                    this.plugin.settings.defaultProject = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('taskTemplate'))
            .setDesc(this.plugin.t('taskTemplateDesc'))
            .addTextArea(text => text
                .setPlaceholder('- [ ] {{content}} [📋]({{url}}) {{priority}} {{labels}} {{due}} {{description}} #tasktodo')
                .setValue(this.plugin.settings.taskNoteTemplate)
                .onChange(async (value) => {
                    this.plugin.settings.taskNoteTemplate = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('insertByDefault'))
            .setDesc(this.plugin.t('insertByDefaultDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.insertTaskInNote)
                .onChange(async (value) => {
                    this.plugin.settings.insertTaskInNote = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('enableTimeSelection'))
            .setDesc(this.plugin.t('enableTimeSelectionDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableTimeSelection)
                .onChange(async (value) => {
                    this.plugin.settings.enableTimeSelection = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: this.plugin.t('consolidatedFilters') });

        new Setting(containerEl)
            .setName(this.plugin.t('consolidatedNotePath'))
            .setDesc(this.plugin.t('consolidatedNotePathDesc'))
            .addText(text => text
                .setPlaceholder('tasks/consolidated-tasks')
                .setValue(this.plugin.settings.consolidatedNotePath)
                .onChange(async (value) => {
                    this.plugin.settings.consolidatedNotePath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('autoRefreshConsolidated'))
            .setDesc(this.plugin.t('autoRefreshConsolidatedDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoRefreshConsolidated)
                .onChange(async (value) => {
                    this.plugin.settings.autoRefreshConsolidated = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.plugin.t('consolidatedRefreshInterval'))
            .setDesc(this.plugin.t('consolidatedRefreshIntervalDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('60', '1 ' + (this.plugin.settings.language === 'es' ? 'minuto' : 'minute'))
                .addOption('300', '5 ' + (this.plugin.settings.language === 'es' ? 'minutos' : 'minutes'))
                .addOption('1800', '30 ' + (this.plugin.settings.language === 'es' ? 'minutos' : 'minutes'))
                .addOption('3600', '60 ' + (this.plugin.settings.language === 'es' ? 'minutos' : 'minutes'))
                .setValue(this.plugin.settings.consolidatedRefreshInterval.toString())
                .onChange(async (value) => {
                    this.plugin.settings.consolidatedRefreshInterval = parseInt(value);
                    await this.plugin.saveSettings();
                }));

        const generateButton = new Setting(containerEl)
            .setName(this.plugin.t('generateConsolidatedNote'))
            .setDesc('Generate a consolidated note with all Todoist tasks based on filters')
            .addButton(button => button
                .setButtonText(this.plugin.t('generateConsolidatedNote'))
                .onClick(() => {
                    this.plugin.generateConsolidatedNote();
                }));
    }
}