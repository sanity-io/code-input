import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {codeInput} from './src/index'

export default defineConfig({
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [
    structureTool({
      structure: (S) => S.documentTypeList('codeTest'),
    }),
    codeInput(),
  ],
  schema: {
    types: [
      {
        name: 'codeTest',
        type: 'document',
        fields: [
          {name: 'title', type: 'string'},
          {name: 'code', type: 'code'},
        ],
      },
    ],
  },
  tasks: {
    enabled: false,
  },
  scheduledPublishing: {
    enabled: false,
  },
  announcements: {
    enabled: false,
  },
  beta: {
    create: {
      startInCreateEnabled: false,
    },
  },
})
