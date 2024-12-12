import {Select} from '@sanity/ui'
import {ChangeEvent, useCallback} from 'react'
import {set, StringInputProps, unset} from 'sanity'

import {CodeInputLanguage} from './types'

export interface LanguageInputProps extends StringInputProps {
  language: string
  languages: CodeInputLanguage[]
}

/** @internal */
export function LanguageInput(props: LanguageInputProps) {
  const {language, languages, onChange} = props

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      onChange(newValue ? set(newValue) : unset())
    },
    [onChange],
  )

  return (
    <Select {...props} value={language} onChange={handleChange}>
      {languages.map((lang: {title: string; value: string}) => (
        <option key={lang.value} value={lang.value}>
          {lang.title}
        </option>
      ))}
    </Select>
  )
}
