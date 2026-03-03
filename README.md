# Todo List Application

This project is a **feature-rich Todo List web application** built with JavaScript, following clean architecture principles and using modern browser APIs for persistence.

## Core Requirements

### 1. Todo Item Structure
Todo items must be created dynamically. Use either:

- Factory functions, **or**
- ES6 classes / constructors

**Required properties** (minimum):
- `title` (string)
- `description` (string)
- `dueDate` (date string or Date object)
- `priority` (e.g. "low", "medium", "high" — or use numbers 1–4)

**Optional but recommended properties**:
- `notes` (string)
- `checklist` (array of subtasks)
- `completed` (boolean, default: false)
- `createdAt` (timestamp)
- `projectId` (to link to a project)

### 2. Projects / Organization
- Todos are organized into **projects** (or lists).
- On first load, create a **default project** (e.g. "Inbox" or "General") where new todos go if no project is selected.
- Users must be able to:
  - Create new projects
  - Select which project a todo belongs to when creating/editing it

### 3. Separation of Concerns (Clean Architecture)
Strictly separate:
- **Application logic** (business rules & data manipulation)
  - Creating todos & projects
  - Marking todos complete
  - Updating priority, due date, etc.
  - Deleting items
- **DOM / UI logic** (rendering, event listeners, DOM manipulation)

Use modules (separate files) for:
- Todo factory/class
- Project factory/class or manager
- Application logic / handlers
- UI / rendering logic
- Storage handling

### 4. User Interface Features
The UI should allow users to:

1. View a list of **all projects** (sidebar or dropdown recommended)
2. Select a project and view its **todos**
   - Show at minimum: title + due date
   - Bonus: color-code by priority, show completion status (checkbox/strikethrough)
3. **Expand** a todo to view/edit full details (description, notes, checklist, etc.)
4. **Delete** a todo (with confirmation if possible)
5. **Mark** todos as complete/incomplete
6. Create new todos and assign them to a project

UI style is up to you — keep it clean and intuitive.  
For inspiration, look at popular todo apps (screenshots, videos, demos):

- [Todoist](https://todoist.com) — excellent project + priority + natural language input
- [Things 3](https://culturedcode.com/things/) — beautiful design, areas/projects, Today/Upcoming views
- [Any.do](https://www.any.do) — simple lists, calendar integration, daily planner feel

### 5. Recommended Library
Use **[date-fns](https://date-fns.org/)** (via npm + webpack) for:
- Formatting dates nicely (`format()`, `isToday()`, `isPast()`, etc.)
- Comparing/manipulating due dates

### 6. Data Persistence with localStorage
Since there's no backend, use the **Web Storage API** (`localStorage`) to save data so todos survive page refresh.

**Implementation steps**:
- Save all projects (including their todos) to `localStorage` whenever:
  - A project is created/renamed/deleted
  - A todo is created/updated/deleted/completed
- On app load:
  - Check if data exists in `localStorage`
  - If yes → parse it and restore projects/todos
  - If no → initialize with a default project
- **Important notes**:
  - `localStorage` only stores strings → use `JSON.stringify()` to save and `JSON.parse()` to load
  - **Functions/methods are lost** when stringifying → after loading, you must **re-hydrate** objects:
    - Convert plain objects back into Todo/Project instances (with methods)
    - Common pattern: create a factory function that takes plain data and returns a full object with methods
  - Handle missing/corrupted data gracefully (don't crash the app)
  - Use DevTools → Application tab → Local Storage to inspect saved data while developing

## Bonus Ideas (Optional Enhancements)
- Sort todos by due date / priority
- Filter todos (today, upcoming, overdue)
- Search todos
- Dark mode toggle
- Checklist/subtasks progress indicator