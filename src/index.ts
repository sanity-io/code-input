import {createPlugin} from 'sanity'

import {codeSchema, codeTypeName, CodeDefinition} from './schema'
import PreviewCode, {PreviewCodeProps} from './PreviewCode'
export type {CodeInputProps, CodeSchemaType, CodeOptions} from './CodeInput'

export type {CodeInputLanguage, CodeInputValue} from './types'

export {PreviewCode, type PreviewCodeProps}
export {codeSchema, codeTypeName}
export type {CodeDefinition}
/**
 * @public
 */
export const codeInput = createPlugin({
  name: '@sanity/code-input',
  schema: {types: [codeSchema]},
})