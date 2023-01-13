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
  ],
})

export const schema = {types: [testType]}
