import {defineConfig} from '@sanity/ui-workshop'
import {sanity} from '@sanity/ui-workshop-plugin-sanity'
import pkg from './package.json'
import sanityConfig from './test/sanity.config'

export default defineConfig({
  title: pkg.name,
  plugins: [sanity({config: sanityConfig})],
})
