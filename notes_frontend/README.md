# Ocean Notes - LightningJS (Blits) Frontend

A modern notes application built with Lightning 3 (Blits). It follows the Ocean Professional theme:
- primary: #2563EB
- secondary/success: #F59E0B
- error: #EF4444
- background: #f9fafb
- surface: #ffffff
- text: #111827

Features:
- Create, select, edit, and delete notes
- Search by title
- Local persistence via localStorage
- Smooth transitions, rounded corners, subtle shadows

Run locally:
1) npm install
2) npm run dev
3) Open the URL on port 3000

Layout:
- Header with app title
- Left panel: searchable notes list with a Create button
- Right panel: detail editor (title + body) and a Delete button (tap twice to confirm)

Keyboard:
- Arrow keys navigate the list
- Enter toggles focus between title and body in the editor; press on buttons to activate
- Back switches editor focus back to title
- Printable keys type into the active field
- Backspace deletes characters

Persistence:
- Notes are saved to localStorage under key notes_app_items_v1.
- You can clear storage from DevTools if needed.

Extending with a backend:
- Replace loadNotes/saveNotes/createNote/upsertNote/deleteNote in src/utils/storage.js with HTTP calls to your API.
- Recommended endpoints:
  - GET /notes -> [{id,title,body,updatedAt}]
  - POST /notes -> {id,title,body,updatedAt}
  - PUT /notes/:id -> {id,title,body,updatedAt}
  - DELETE /notes/:id -> 204
- Keep the same note shape so UI logic remains the same.

Code structure:
- src/pages/Home.js: page layout and wiring
- src/components/Header.js: header with title and helper chip
- src/components/NotesList.js: search bar, create, list items, delete
- src/components/NoteEditor.js: title/body editor and delete
- src/utils/storage.js: local persistence helpers
- src/styles/theme.css: design tokens documentation

Lightning/Blits notes:
- No DOM/HTML/CSS for rendering; UI is WebGL. The theme.css is provided as a developer aid.
- Use Blits.Application(), Blits.Component(), and RouterView as already configured.

Resources:
- Blits docs: https://lightningjs.io/v3-docs/blits/getting_started/intro.html
- Blits Example App: https://blits-demo.lightningjs.io/?source=true
- Blits Components: https://lightningjs.io/blits-components.html
