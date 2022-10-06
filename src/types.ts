/**
 * @public
 */
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
