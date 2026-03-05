// Store
// Single source of truth for all app state
// Pure logic: no querySelector, no innerHTML here

import { Todo, Project } from "./todo.js";
import { saveTodos, loadTodos, saveProjects, loadProjects} from "./storage.js";

// Seed / hydrate

function hydrateProject(raw) {
    return raw.map((p) => new Project(p));
}

function hydrateTodos(raw) {
    return raw.map((t) => new Todo(t));
}

function createDefaults() {
    const inbox = new Project({ id: "inbox", name: "Inbox" });
    const demo = new Todo({
        title:          "Welcome! Click me to see details",
        description:    "You can expand any task to edit it.",
        dueDate:        new Date().toISOString().slice(0, 10),
        priority:       "high",
        projectId:      "inbox",
    });
    return { projects: [inbox], todos: [demo] };
}

// Bootstrap

let _projects   = [];
let _todos      = [];

function init() {
    const savedProjects = loadProjects();
    const savedTodos    = loadTodos();

    if (savedProject && savedTodos) {
        _projects   = hydrateProject(savedProjects);
        _todos      = hydrateTodos(savedTodos);
    } else {
        const defaults = createDefaults();
        _projects   = defaults.projects;
        _todos      = defaults.todos;
        persist();
    }
}

function persist() {
    saveProjects(_projects);
    saveTodos(_todos);
}

// Project CRUD
