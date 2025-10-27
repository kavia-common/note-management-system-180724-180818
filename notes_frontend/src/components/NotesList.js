import Blits from '@lightningjs/blits'

/**
 * Props:
 * - items: Note[]
 * - selectedId: string | null
 * - query: string
 * - onSelect(id)
 * - onCreate()
 * - onQueryChange(value)
 * - onDelete(id)
 */
export default Blits.Component('NotesList', {
  props: ['items', 'selectedId', 'query', 'onSelect', 'onCreate', 'onQueryChange', 'onDelete'],
  template: `
    <Element :w="$w" :h="$h" :color="$surface" :effects="[$shader('radius', {radius: 16})]">
      <!-- Search bar -->
      <Element x="24" y="24" :w="$w - 48" h="64" :color="$inputBg" :effects="[$shader('radius', {radius: 12})]">
        <Text x="20" y="18" size="28" :color="$placeholder" :content="$queryDisplay" />
      </Element>

      <!-- Create button -->
      <Element x="24" y="100" :w="$w - 48" h="56" :color="$primary" :effects="[$shader('radius', {radius: 12})]" @enter="$handleCreate">
        <Text x="20" y="12" size="28" color="#ffffff" content="+ Create note" />
      </Element>

      <!-- List -->
      <Element x="0" y="172">
        <Element
          :for="(item, index) in $filtered"
          :key="$item.id"
          :x="16"
          :y="$index * 92"
          :w="$w - 32"
          h="84"
          :color="$item.id === $selectedId ? $selectedBg : $rowBg"
          :effects="[$shader('radius', {radius: 12})]"
          @enter="$selectItem"
          @down="$moveDown"
          @up="$moveUp"
        >
          <Text x="24" y="18" size="28" color="#111827" :content="$item.title || 'Untitled note'" />
          <Text x="24" y="52" size="20" color="#6b7280" :content="$relativeTime($item.updatedAt)" />
          <Element :x="$w - 32 - 48" y="18" w="40" h="40" :color="$deleteBg" :effects="[$shader('radius', {radius: 10})]" @enter="$deleteItem">
            <Text x="10" y="6" size="26" color="#ffffff" content="✕" />
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      w: 640,
      h: 880,
      surface: '#ffffff',
      primary: '#2563EB',
      rowBg: '#f9fafb',
      selectedBg: '#dbeafe',
      deleteBg: '#EF4444',
      inputBg: '#f3f4f6',
      placeholder: '#6b7280',
      internalIndex: 0,
    }
  },
  computed: {
    filtered() {
      const q = (this.query || '').toLowerCase().trim()
      if (!q) return this.items || []
      return (this.items || []).filter((n) => (n.title || '').toLowerCase().includes(q))
    },
    queryDisplay() {
      if (!this.query) return 'Search notes...'
      return `🔎 ${this.query}`
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    $relativeTime(ts) {
      /** Format updatedAt as relative time. */
      if (!ts) return ''
      const diff = Date.now() - ts
      const min = Math.round(diff / 60000)
      if (min < 1) return 'just now'
      if (min < 60) return `${min}m ago`
      const hr = Math.round(min / 60)
      if (hr < 24) return `${hr}h ago`
      const d = Math.round(hr / 24)
      return `${d}d ago`
    },
    $moveDown() {
      if (!this.filtered.length) return
      this.internalIndex = Math.min(this.internalIndex + 1, this.filtered.length - 1)
      const id = this.filtered[this.internalIndex].id
      this.onSelect && this.onSelect(id)
    },
    $moveUp() {
      if (!this.filtered.length) return
      this.internalIndex = Math.max(this.internalIndex - 1, 0)
      const id = this.filtered[this.internalIndex].id
      this.onSelect && this.onSelect(id)
    },
    $selectItem() {
      if (!this.filtered.length) return
      const id = this.filtered[this.internalIndex]?.id || this.selectedId
      if (id) this.onSelect && this.onSelect(id)
    },
    $handleCreate() {
      this.onCreate && this.onCreate()
      this.internalIndex = 0
    },
    $deleteItem() {
      const id = this.filtered[this.internalIndex]?.id || this.selectedId
      if (!id) return
      this.onDelete && this.onDelete(id)
      this.internalIndex = 0
    },
  },
  input: {
    left(e) {
      // allow parent to handle focus change if needed
      if (this.parent && this.parent.focus) this.parent.focus(e)
    },
    enter() {
      // noop; handled via element events
    },
  },
})
