import {CodeBlockIcon} from '@sanity/icons'
import {CodeInput} from './CodeInput'
import PreviewCode from './PreviewCode'
import {getMedia} from './getMedia'
import {defineType, ObjectDefinition} from 'sanity'
import {CodeOptions} from './types'

/**
 * @public
 */
export const codeTypeName = 'code' as const

/**
 * @public
 */
export interface CodeDefinition extends Omit<ObjectDefinition, 'type' | 'fields' | 'options'> {
  type: typeof codeTypeName
  options?: CodeOptions
}

declare module '@sanity/types' {
  // makes type: 'code' narrow correctly when using defineType/defineField/defineArrayMember
  export interface IntrinsicDefinitions {
    code: CodeDefinition
  }
}

/**
 * @public
 */
export const codeSchema = defineType({
  name: 'code',
  type: 'object',
  title: 'Code',
  components: {input: CodeInput, preview: PreviewCode},
  icon: CodeBlockIcon,
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
    },
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
    },
    {
      title: 'Code',
      name: 'code',
      type: 'text',
    },
    {
      title: 'Highlighted lines',
      name: 'highlightedLines',
      type: 'array',
      of: [
        {
          type: 'number',
          title: 'Highlighted line',
        },
      ],
    },
  ],
  preview: {
    select: {
      language: 'language',
      code: 'code',
      filename: 'filename',
      highlightedLines: 'highlightedLines',
    },
    prepare: (value: {
      language?: string
      code?: string
      filename?: string
      highlightedLines?: number[]
    }) => {
      return {
        title: value.filename || (value.language || 'unknown').toUpperCase(),
        media: getMedia(value?.language),
        selection: value,
      }
    },
  },
})
