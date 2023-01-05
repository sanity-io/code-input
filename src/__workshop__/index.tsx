import {defineScope} from '@sanity/ui-workshop'
import {lazy} from 'react'

export default defineScope({
  name: 'code-mirror',
  title: 'CodeMirror',
  stories: [
    {
      name: 'lazy',
      title: 'Lazy',
      component: lazy(() => import('./CodeMirrorStory')),
    },
  ],
})
