import {createPlugin} from 'sanity'
import schema from './schema'
import PreviewCode from './PreviewCode'

export type {CodeInputProps, CodeSchemaType} from './CodeInput'
export type {CodeInputLanguage, CodeInputValue} from './types'
export {PreviewCode}

export const codeInput = createPlugin({
  name: '@sanity/code-input',
  schema: {types: [schema]},
})
