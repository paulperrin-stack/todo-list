// APP LOGIC - No DOM

export class Todo {
    constructor({
        id = crypto.randomUUID(),
        title,
        description = "",
        dueDate = "",
        priority = "medium", // "high" | "medium" | "low"
        notes = "",
        projectId,
        completed = false,
        createdAt = Date.now(),
    }) {
        this.id             = id;
        this.title          = title;
        this.description    = description;
        this.dueDate        = dueDate;
        this.priority       = priority;
        this.notes          = notes;
        this.projectId      = projectId;
        this.completed      = completed;
        this.createdAt      = createdAt;
    }

    toggleComplete() {
        this.completed      = !this.completed;
    }

    update(fields) {
        const allowed = ["title", "description", "dueDate", "priority", "notes", "projectId"];
        allowed.forEach((key) => {
            if (fields[key] !== undefined) this[key] = fields[key];
        });
    }
}

export class Project {
    constructor({ id = crypto.randomUUID(), name }) {
        this.id             = id;
        this.name           = name;
    }
}