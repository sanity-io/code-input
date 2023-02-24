import {defineScope} from '@sanity/ui-workshop'
import {lazy} from 'react'

export default defineScope({
  stories: [
    {
      name: 'props',
      title: 'Props',
      component: lazy(() => import('./props')),
    },
    {
      name: 'preview',
      title: 'Preview',
      component: lazy(() => import('./preview')),
    },
    {
      name: 'lazy',
      title: 'Lazy',
      component: lazy(() => import('./lazy')),
    },
  ],
})
