import {createPlugin} from 'sanity'
import {codeSchema, CodeDefinition} from './schema'

import PreviewCode, {PreviewCodeProps} from './PreviewCode'
export type {CodeInputProps, CodeSchemaType, CodeOptions} from './CodeInput'
export type {CodeInputLanguage, CodeInputValue} from './types'

export {PreviewCode, type PreviewCodeProps}
export {codeSchema}
export type {CodeDefinition}
/**
 * @public
 */
export const codeInput = createPlugin({
  name: '@sanity/code-input',
  schema: {types: [codeSchema]},
})
