import {useCallback} from 'react'
import {
  FieldMember,
  type InputProps,
  MemberField,
  type MemberFieldProps,
  type PrimitiveInputElementProps,
} from 'sanity'

import {LanguageInput} from './LanguageInput'
import type {CodeInputLanguage} from './types'

export function LanguageField(
  props: MemberFieldProps & {member: FieldMember; language: string; languages: CodeInputLanguage[]},
) {
  const {member, languages, language, renderItem, renderField, renderPreview} = props

  const renderInput = useCallback(
    ({elementProps, onChange}: Omit<InputProps, 'renderDefault'>) => {
      return (
        <LanguageInput
          onChange={onChange}
          elementProps={elementProps as PrimitiveInputElementProps}
          language={language}
          languages={languages}
        />
      )
    },
    [languages, language],
  )

  return (
    <MemberField
      member={member}
      renderItem={renderItem}
      renderField={renderField}
      renderInput={renderInput}
      renderPreview={renderPreview}
    />
  )
}
