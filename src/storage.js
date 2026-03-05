// Storage
// This wrapper around localStorage

const KEYS = {
    todos:      "todos",
    projects:    "projects",
};

export function saveTodos(todos) {
    try {
        localStorage.setItem(KEYS.todos, JSON.stringify(todos));
    } catch (e) {
        console.warn("Could not save todos:", e);
    }
}

export function loadTodos() {
    try {
        const raw = localStorage.getItem(KEYS.todos);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveProjects(projects) {
    try {
        localStorage.setItem(KEYS.projects, JSON.stringify(projects));
    } catch (e) {
        console.warn("Could not save projects:", e);
    }
}

export function loadProjects() {
    try {
        const raw = localStorage.getItem(KEYS.projects);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}