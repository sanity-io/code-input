import {Select} from '@sanity/ui'
import {type ChangeEvent, useCallback} from 'react'
import {set, type StringInputProps, unset} from 'sanity'

import {CodeInputLanguage} from './types'

export interface LanguageInputProps {
  language: string
  languages: CodeInputLanguage[]
  onChange: StringInputProps['onChange']
  elementProps: StringInputProps['elementProps']
}

/** @internal */
export function LanguageInput(props: LanguageInputProps) {
  const {language, languages, onChange, elementProps} = props

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      onChange(newValue ? set(newValue) : unset())
    },
    [onChange],
  )

  return (
    <Select {...elementProps} value={language} onChange={handleChange}>
      {languages.map((lang: {title: string; value: string}) => (
        <option key={lang.value} value={lang.value}>
          {lang.title}
        </option>
      ))}
    </Select>
  )
}
