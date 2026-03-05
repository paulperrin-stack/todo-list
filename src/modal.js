// MODAL

import { getProjects } from "./store.js";

// Shared overlay

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    return overlay;
}

function closeModal(overlay) {
    overlay.remove();
}

// Todo modal

/**
 * @param {object}   opts
 * @param {object}  [opts.todo]         – existing todo for edit mode (omit for add)
 * @param {string}  [opts.defaultProject] – pre-select a project in add mode
 * @param {function} opts.onSave        – called with plain-object field values
 */

export function openTodoModal({ todo = null, defaultProject = "inbox", onSave }) {
    const overlay = createOverlay();
    const isEdit = !!todo;

    overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${isEdit ? "Edit" : "Add"} task">
        <div class="modal-header">
            <h3>${isEdit ? "Edit Task" : "New Task"}</h3>
            <button class="modal-close" aria-label="Close">×</button>
        </div>

        <div class="modal-body">
            <label>
                Title <span class="required">*</span>
                <input type="text" id="m-title" value="${esc(todo?.title ?? "")}" placeholder="Task title" />
            </label>

            <label>
                Description
                <textarea id="m-desc" rows="3" placeholder="Optional description">${esc(todo?.description ?? "")}</textarea>
            </label>

            <div class="modal-row">
                <label>
                    Due Date
                    <input type="date" id="m-due" value="${esc(todo?.dueDate ?? "")}" />
                </label>

                <label>
                    Priority
                    <select id="m-priority">
                        ${["high", "medium", "low"].map((p) =>
                            `<option value="${p}" ${(todo?.priority ?? "medium") === p ? "selected" : ""}>${cap(p)}</option>`
                        ).join("")}
                    </select>
                </label>
            </div>

            <label>
                List
                <select id="m-project">
                ${getProjects().map((p) =>
                    `<option value="${p.id}" ${(todo?.projectId ?? defaultProject) === p.id ? "selected" : ""}>${esc(p.name)}</option>`
                ).join("")}
                </select>
            </label>

            <label>
                Notes
                <textarea id="m-notes" rows="2" placeholder="Additional notes">${esc(todo?.notes ?? "")}</textarea>
            </label>
        </div>

        <div class="modal-footer">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-save btn-primary">${isEdit ? "Save Changes" : "Add Task"}</button>
        </div>
    </div>
    `;

    document.body.appendChild(overlay);

    // focus title
    overlay.querySelector("#m-title").focus();

    // close button
    overlay.querySelector(".modal-close").addEventListener("click", () => closeModal(overlay));
    overlay.querySelector(".btn-cancel").addEventListener("click", () => closeModal(overlay));

    // save button
    overlay.querySelector(".btn-save").addEventListener("click", () => {
        const title = overlay.querySelector("#m-title").value.trim();
        if (!title) {
            overlay.querySelector("#m-title").classList.add("input-error");
            return;
        }
        onSave({
            title,
            description:    overlay.querySelector("#m-desc").value.trim(),
            dueDate:        overlay.querySelector("#m-due").value,
            priority:       overlay.querySelector("#m-priority").value,
            projectId:      overlay.querySelector("#m-project").value,
            notes:          overlay.querySelector("#m-notes").value.trim(),
        });
        closeModal(overlay);
    });
}
    // new list modal

export function openListModal({ onSave }) {
    const overlay = createOverlay();

    overlay.innerHTML = `
        <div class="modal modal--small" role="dialog" aria-modal="true" aria-label="New list">
            <div class="modal-header">
                <h3>New List</h3>
                <button class="modal-close" aria-label="Close">×</button>
            </div>
            <div class="modal-body">
                <label>
                    List name <span class="required">*</span>
                    <input type="text" id="m-list-name" placeholder="e.g. Work, Personal" />
                </label>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-save btn-primary">Create</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector("#m-list-name").focus();

    overlay.querySelector(".modal-close").addEventListener("click", () => closeModal(overlay));
    overlay.querySelector(".btn-cancel").addEventListener("click", () => closeModal(overlay));

    overlay.querySelector(".btn-save").addEventListener("click", () => {
        const name = overlay.querySelector("#m-list-name").value.trim();
        if (!name) {
            overlay.querySelector("#m-list-name").classList.add("input-error");
            return;
        }
        onSave(name);
        closeModal(overlay);
    });
}

// Helpers

function esc(str) {
    return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}