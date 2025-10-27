import Blits from '@lightningjs/blits'

export default Blits.Component('Header', {
  template: `
    <Element :w="$w" :h="$h" :color="$bg" :effects="[$shader('radius', {radius: 0})]">
      <Element
        :w="$w"
        h="6"
        :y="0"
        :color="$accent"
      />
      <Element x="32" y="24">
        <Text size="48" color="#111827" content="Ocean Notes" />
        <Text y="56" size="22" color="#6b7280" content="Modern note taking with Lightning" />
      </Element>
      <Element :x="$w - 280" y="24" :w="240" :h="56" :color="$chip" :effects="[$shader('radius', {radius: 12})]">
        <Text x="16" y="14" size="24" color="#111827" content="Press Enter to select" />
      </Element>
    </Element>
  `,
  state() {
    return {
      w: 1920,
      h: 120,
      bg: '#ffffff',
      accent: { left: '#2563EB22', right: '#2563EB00' }, // subtle top accent
      chip: '#f3f4f6',
    }
  },
})
