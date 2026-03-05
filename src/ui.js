// DOM

import {
    getProjects,
    getTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    addProject,
    deleteProject,
    countFor,
} from "./store.js";
import { openTodoModal, openListModal } from "./modal";

// State

const state = {
    view:           "inbox",
    projectId:      null,
    sortBy:         "dueDate",
    filterPriority: "all",
    search:         "",
};

// DOM refs

const $projectsList     = document.getElementById("projects-list");
const $todosContainer   = document.getElementById("todos-container");
const $emptyState       = document.getElementById("empty-state");
const $viewTitle        = document.getElementById("current-view-title");
const $sortSelect       = document.getElementById("sort-select");
const $filterPriority   = document.getElementById("fitler-priority");
const $searchInput      = document.getElementById("search-input");
const $btnNewTask       = document.getElementById("btn-new-task");
const $btnNewList       = document.getElementById("btn-new-list");
const $smartItems       = document.querySelectorAll(".smart-views li");

// Boot

export function init() {
    bindStaticEvents();
    render();
}

// Render orchestrator

function render() {
    renderSidebar();
    renderTodo();
}

// Sibebar

const SMART_VIEWS = ["inbox", "today", "upcoming", "anytime"];

function renderSibebar() {
    $smartItems.forEach((li) => {
        const v = li.dataset.view;
        li.querySelector(".count").textContent = countFor(v, null);
        li.classList.toggle("active", state.view === v && !state.projectId);
    });

    $projectsList.innerHTML = "";
    getProjects().forEach((project) => {
        const li = document.createElement("li");
        li.dataset.projectId = project.id;
        li.classList.toggle("active", state.projectId === project.id);

        li.innerHTML = `
            <span class="project-name">${escHTML(project.name)}</span>
            <span class="count">${countFor(null, project.id)}</span>
            ${project.id !== "inbox" ? `<button class="btn-delete-project" aria-label="Delete list" title="Delete list">×</button>` : ""}
    `;

    li.addEventListener("click", (e) => {
        if (e.target.closest(".btn-delete-project")) {
            handleDeleteProject(project.id, project.name);
            return;
        }
        activateProject(project.id, project.name);
    });

    $projectsList.appendChild(li);
    });
}

// Todo List

function renderTodos() {
    const todos = getTodos({
        view:           state.view,
        projectId:      state.projectId,
        search:         state.search,
        sortBy:         state.sortBy,
        filterPriority: state.filterPriority,
    });

    // Header title
    if (state.projectId) {
        const proj = getProjects().find((p) => p.id === state.projectId);
        $viewTitle.textContent = proj ? proj.name : "List";
    } else {
        $viewTitle.textContent = capitalize(state.view);
    }

    $todosContainer.innerHTML = "";

    if (todos.length === 0) {
        $emptyState.classList.remove("hidden");
        return;
    }
    $emptyState.classList.add("hidden");

    todos.forEach((todo) => {
        $todosContainer.appendChild(buildTodoEl(todo));
    });
}

function buildTodoEl(todo) {
    const div = document.createElement("div");
    div.className = `todo-item priority-${todo.priority}${todo.completed ? "completed" : ""}`;
    div.dataset.id = todo.id;

    const proj = getProjects().find((p) => p.id === todo.projectId);

    div.innerHTML = `
        <input type="checkbox" aria-label="Complete task" ${todo.completed ? "checked" : ""} />
        <div class="todo-body">
        <span class="title">${escHTML(todo.title)}</span>
        <div class="todo-meta">
            ${todo.dueDate ? `<span class="due ${dueCls(todo.dueDate)}">${formatDate(todo.dueDate)}</span>` : ""}
            ${proj ? `<span class="project-tag">${escHTML(proj.name)}</span>` : ""}
            ${todo.notes ? `<span class="has-notes" title="Has notes">📝</span>` : ""}
        </div>
        </div>
        <button class="btn-expand" aria-label="Edit task" title="Edit task">✎</button>
        <button class="btn-delete" aria-label="Delete task" title="Delete task">×</button>
    `;

    // Checkbox
    div.querySelector("input[type=checkbox]").addEventListener("change", () => {
        toggleTodo(todo.id);
        render();
    });

    // Edit
    div.querySelector(".btn-expand").addEventListener("click", () => {
        openTodoModal({
            todo,
            onSave: (fields) => {
                updateTodo(todo.id, fields);
                render();
            },
        });
    });

    // Delete
    div.querySelector(".btn-delete").addEventListener("click", () => {
        deleteTodo(todo.id);
        render();
    });

    return div;
}

// Navigation helpers

function activateView(view) {
    state.view      = view;
    state.projectId = null;
    render();
}

function activateProject(id, name) {
    state.view      = null;
    state.projectId = id;
    $smartItems.forEach((li) => li.classList.remove("active"));
    render();
}

// Event buildings

function bindStaticEvents() {
    // Smart view
    $smartItems.forEach((li) => {
        li.addEventListener("click", () => activateView(li.dataset.view));
    });

    // Sort
    $sortSelect.addEventListener("change", () => {
        state.sortBy = $sortSelect.value;
        renderTodos();
    });

    // Filter priority
    $filterPriority.addEventListener("change", () => {
        state.filterPriority = $filterPriority.value;
        renderTodos();
    });

    // Search
    $searchInput.addEventListener("input", () => {
        state.search = $searchInput.value;
        renderTodos();
    })

    // New Task
    $btnNewTask.addEventListener("click", () => {
        openTodoModal({
            defaultProject: state.projectId ?? "inbox",
            onSave: (fields) => {
                addTodo(fields);
                render();
            },
        });
    });
}

// Project delete

function handleDeleteProject(id, name) {
    if (!confirm(`Delete list "${name}"? Todos will be removed to Inbox.`)) return;
    deleteProject(id);
    if (state.projectId === id) activateView("inbox");
    else render();
}

// Formatting helpers

function formateDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((date - today) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dueCls(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return "overdue";
    if (date.getTime() === today.getTime()) return "due-today";
    return "";
}

function escHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}