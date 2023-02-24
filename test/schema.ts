import {defineType} from 'sanity'

const testType = defineType({
  type: 'document',
  name: 'test',
  title: 'Test',
  fields: [
    {
      type: 'string',
      name: 'title',
      title: 'Title',
    },
    {
      type: 'code',
      name: 'code',
      title: 'Code',
    },
    {
      type: 'array',
      name: 'content',
      of: [{name: 'code', type: 'code', options: {withFilename: true}}],
    },
  ],
})

export const schema = {types: [testType]}
