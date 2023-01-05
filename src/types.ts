import {ObjectSchemaType} from 'sanity'

export interface CodeInputLanguage {
  title: string
  value: string
  mode?: string
}

/**
 * @public
 */
export interface CodeInputValue {
  _type?: 'code'
  code?: string
  filename?: string
  language?: string
  highlightedLines?: number[]
}
/**
 * @public
 */
export interface CodeOptions {
  theme?: string
  darkTheme?: string
  languageAlternatives?: CodeInputLanguage[]
  language?: string
  withFilename?: boolean
}

/**
 * @public
 */
export interface CodeSchemaType extends Omit<ObjectSchemaType, 'options'> {
  options?: CodeOptions
}
