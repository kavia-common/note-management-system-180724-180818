import Blits from '@lightningjs/blits'
import Header from '../components/Header.js'
import NotesList from '../components/NotesList.js'
import NoteEditor from '../components/NoteEditor.js'
import { loadNotes, saveNotes, createNote, upsertNote, deleteNote } from '../utils/storage.js'

export default Blits.Component('Home', {
  components: { Header, NotesList, NoteEditor },
  template: `
    <Element w="1920" h="1080" color="#f9fafb">
      <Header />

      <!-- Main content area -->
      <Element x="40" y="140" :w="1920 - 80" :h="1080 - 180">
        <!-- Left: Notes list -->
        <Element w="640" :h="$contentH" :effects="[$shader('radius', {radius: 16})]" :color="$surface" :alpha.transition="{value: 1, duration: 300}">
          <NotesList
            :items="$notes"
            :selectedId="$selectedId"
            :query="$query"
            :onSelect="$onSelect"
            :onCreate="$onCreate"
            :onQueryChange="$onQueryChange"
            :onDelete="$onDelete"
          />
        </Element>

        <!-- Right: Editor -->
        <Element x="680" :h="$contentH" :w="(1920 - 80) - 680">
          <NoteEditor
            :note="$selectedNote"
            :onChange="$onChange"
            :onDelete="$onDelete"
          />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    const initialNotes = loadNotes()
    const selectedId = initialNotes[0]?.id || null
    return {
      notes: initialNotes,
      selectedId,
      query: '',
      surface: '#ffffff',
      contentH: 900,
    }
  },
  computed: {
    selectedNote() {
      return this.notes.find((n) => n.id === this.selectedId) || null
    },
  },
  methods: {
    $onSelect(id) {
      this.selectedId = id
    },
    $onCreate() {
      const n = createNote()
      this.notes = upsertNote(this.notes, n)
      saveNotes(this.notes)
      this.selectedId = n.id
    },
    $onQueryChange(v) {
      this.query = v
    },
    $onChange(updated) {
      this.notes = upsertNote(this.notes, updated)
      saveNotes(this.notes)
      this.selectedId = updated.id
    },
    $onDelete(id) {
      // confirm deletion
      const note = this.notes.find((n) => n.id === id)
      if (!note) return
      // Confirmation in WebGL UI is limited; using a simple state approach:
      this.notes = deleteNote(this.notes, id)
      saveNotes(this.notes)
      this.selectedId = this.notes[0]?.id || null
    },
  },
})
