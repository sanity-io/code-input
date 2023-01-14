import {useCallback} from 'react'
import {FieldMember, InputProps, MemberField, MemberFieldProps, StringInputProps} from 'sanity'
import {CodeInputLanguage} from './types'
import {LanguageInput} from './LanguageInput'

export function LanguageField(
  props: MemberFieldProps & {member: FieldMember; language: string; languages: CodeInputLanguage[]}
) {
  const {member, languages, language, renderItem, renderField, renderPreview} = props

  const renderInput = useCallback(
    (inputProps: Omit<InputProps, 'renderDefault'>) => {
      return (
        <LanguageInput
          {...(inputProps as StringInputProps)}
          language={language}
          languages={languages}
        />
      )
    },
    [languages, language]
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
