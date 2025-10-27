import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'

export default Blits.Application({
  template: `
    <Element color="#f9fafb">
      <RouterView />
    </Element>
  `,
  routes: [{ path: '/', component: Home }],
})
