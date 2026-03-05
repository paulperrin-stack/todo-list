# Todo List v1

A simple todo list app built with vanilla JavaScript and Webpack.

## Features

- Create, edit and delete tasks
- Organize tasks into lists
- Set priority (high, medium, low) and due dates
- Filter by priority, sort by date / name
- Search tasks
- Smart views: Inbox, Today, Upcoming, Anytime
- Data saved to localStorage

## Stack

- Vanilla JavaScript (ES6 modules)
- Webpack + Babel
- CSS

## Get Started

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
  index.js      # entry point
  todo.js       # Todo and Project classes
  store.js      # app state and logic
  storage.js    # localStorage persistence
  ui.js         # DOM rendering
  modal.js      # add/edit dialogs
  styles/
    main.css
    modal.css
```

## Notes

- No backend — data lives in the browser only
- Refreshing the page keeps your data (localStorage)
- Deleting a list moves its tasks to Inbox