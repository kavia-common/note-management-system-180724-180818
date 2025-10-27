const STORAGE_KEY = 'notes_app_items_v1'

/**
 * Note shape:
 * {
 *   id: string,
 *   title: string,
 *   body: string,
 *   updatedAt: number
 * }
 */

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Loads notes from localStorage; returns [] if none or on error. */
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch (e) {
    console.warn('Failed to load notes from localStorage', e)
    return []
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Persists provided notes array to localStorage. */
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.warn('Failed to save notes to localStorage', e)
  }
}

// PUBLIC_INTERFACE
export function createNote() {
  /** Creates a new empty note with unique id and returns it (not saved). */
  const id = `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const ts = Date.now()
  return { id, title: 'Untitled note', body: '', updatedAt: ts }
}

// PUBLIC_INTERFACE
export function upsertNote(notes, note) {
  /** Inserts or updates a note within the array and returns new array. */
  const idx = notes.findIndex((n) => n.id === note.id)
  const updated = { ...note, updatedAt: Date.now() }
  if (idx === -1) return [updated, ...notes]
  const copy = notes.slice()
  copy[idx] = updated
  // sort by updatedAt desc
  copy.sort((a, b) => b.updatedAt - a.updatedAt)
  return copy
}

// PUBLIC_INTERFACE
export function deleteNote(notes, id) {
  /** Removes a note by id and returns new array. */
  return notes.filter((n) => n.id !== id)
}

/*
How to extend with a backend later:
- Replace loadNotes/saveNotes calls with async fetch calls to your backend.
- Keep the API surface:
    - GET /notes -> returns [] of notes
    - POST /notes -> creates a note
    - PUT /notes/:id -> updates a note
    - DELETE /notes/:id -> deletes a note
- Ensure the shape matches {id, title, body, updatedAt}.
- You can still call saveNotes to keep a local cache if desired.
*/
