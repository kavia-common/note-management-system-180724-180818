import Blits from '@lightningjs/blits'

/**
 * Props:
 * - note: {id, title, body, updatedAt} | null
 * - onChange(note)
 * - onDelete(id)
 */
export default Blits.Component('NoteEditor', {
  props: ['note', 'onChange', 'onDelete'],
  template: `
    <Element :w="$w" :h="$h" :color="$surface" :effects="[$shader('radius', {radius: 16})]">
      <Element x="24" y="24" :w="$w - 48" h="64" :color="$inputBg" :effects="[$shader('radius', {radius: 12})]">
        <Text x="20" y="18" size="28" color="#111827" :content="$titleDisplay" />
      </Element>

      <Element x="24" y="100" :w="$w - 48" :h="$h - 180" :color="$inputBg" :effects="[$shader('radius', {radius: 12})]">
        <Text x="20" y="20" size="26" color="#111827" :content="$bodyDisplay" />
      </Element>

      <Element :x="$w - 24 - 160" :y="$h - 24 - 56" w="160" h="56" :color="$danger" :effects="[$shader('radius', {radius: 12})]" @enter="$confirmDelete">
        <Text x="22" y="12" size="28" color="#ffffff" content="Delete" />
      </Element>
    </Element>
  `,
  state() {
    return {
      w: 1240,
      h: 880,
      surface: '#ffffff',
      inputBg: '#f3f4f6',
      danger: '#EF4444',
      titleCursor: 0,
      bodyCursor: 0,
      mode: 'title', // or 'body'
      confirm: false,
    }
  },
  computed: {
    titleDisplay() {
      if (!this.note) return 'Select or create a note'
      return this.note.title || 'Untitled note'
    },
    bodyDisplay() {
      if (!this.note) return 'Type your note body here...'
      return this.note.body || ''
    },
  },
  methods: {
    _emitChange(partial) {
      if (!this.note) return
      const next = { ...this.note, ...partial }
      this.onChange && this.onChange(next)
    },
    _appendChar(c) {
      if (!this.note) return
      if (this.mode === 'title') {
        const val = (this.note.title || '') + c
        this._emitChange({ title: val })
      } else {
        const val = (this.note.body || '') + c
        this._emitChange({ body: val })
      }
    },
    _backspace() {
      if (!this.note) return
      if (this.mode === 'title') {
        const val = (this.note.title || '')
        this._emitChange({ title: val.slice(0, -1) })
      } else {
        const val = (this.note.body || '')
        this._emitChange({ body: val.slice(0, -1) })
      }
    },
    $confirmDelete() {
      if (!this.note) return
      if (!this.confirm) {
        this.confirm = true
        // show small confirm chip
        this.$setTimeout(() => (this.confirm = false), 2000)
        return
      }
      this.onDelete && this.onDelete(this.note.id)
      this.confirm = false
    },
  },
  input: {
    enter() {
      // toggle edit area between title and body
      this.mode = this.mode === 'title' ? 'body' : 'title'
    },
    back() {
      // switch back to title editing
      this.mode = 'title'
    },
    // Basic text input emulation: use printable characters of the key label if present
    key(e) {
      const k = e && (e.key || e.code || '')
      if (!k) return
      if (k === 'Backspace') {
        this._backspace()
        return
      }
      if (k.length === 1) {
        this._appendChar(k)
        return
      }
      // Space
      if (k === 'Space' || k === ' ') {
        this._appendChar(' ')
      }
    },
  },
})
