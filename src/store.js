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

    if (savedProjects && savedTodos) {
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

export function getProjects() {
    return [..._projects];
}

export function getProject(id) {
    return _projects.find((p) => p.id === id) ?? null;
}

export function addProject(name) {
    const project = new Project({ name: name.trim() });
    _projects.push(project);
    persist();
    return project;
}

export function deleteProject(id) {
    if (id === "inbox") return false;
    _projects = _projects.filter((p) => p.id !== id);
    // move orphaned todos to inbox
    _todos.forEach((t) => { if (t.projectId === id) t.projectId = "inbox"; });
    persist();
    return true;
}

// Todo CRUD

export function getTodos({ projectId, view, search, sortBy, filterPriorty } = {}) {
    let list = [..._todos];

    // view filter
    if (view === "today") {
        const today = todayStr();
        list = list.filter((t) => t.dueDate === today);
    } else if (view === "upcoming") {
        const today = todayStr();
        list = list.filter((t) => t.dueDate && t.dueDate > today);
    } else if (view === "anytime") {
        list = list.filter((t) => !t.dueDate);
    } else if (projectId) {
        list = list.filter((t) => t.projectId === projectId);
    }
    // "inbox" view = all todos

    if (search) {
        const q = search.toLowerCase();
        list = list.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
        );
    }

    // priority filter
    if (filterPriority && filterPriority !== "all") {
        list = list.filter((t) => t.priority === filterPriority);
    }

    // sort
    if (sortBy === "dueDate") {
        list.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        });
    } else if (sortBy === "priority") {
        const rank = { high: 0, medium: 1, low: 2 };
        list.sort((a, b) => rank[a.priority] - rank[b.priority]);
    } else if (sortBy === "name") {
        list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
}

export function getTodo(id) {
    return _todos.find((t) => t.id === id) ?? null;
}

export function addTodo(fields) {
    const todo = new Todo(fields);
    _todos.push(todo);
    persist();
    return todo;
}

export function updateTodo(id, fields) {
    const todo = getTodo(id);
    if (!todo) return false;
    todo.update(fields);
    persist();
    return true;
}

export function toggleTodo(id) {
    const todo = getTodo(id);
    if (!todo) return false;
    todo.toggleComplete();
    persist();
    return true;
}

export function deleteTodo(id) {
    _todos = _todos.filter((t) => t.id !== id);
    persist();
}

// Counts

export function countFor(view, projectId) {
    return getTodos({ view, projectId }).filter((t) => !t.completed).length;
}

// Helpers

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

// Auto-init on import
init();