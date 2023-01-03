/* eslint-disable react/jsx-handler-names */
import React, {Suspense, useCallback, useMemo} from 'react'
import {
  FieldMember,
  InputProps,
  MemberField,
  ObjectInputProps,
  ObjectMember,
  RenderInputCallback,
  set,
  setIfMissing,
  StringInputProps,
  unset,
} from 'sanity'
import {Card, Select, Stack, ThemeColorSchemeKey} from '@sanity/ui'
import styled from 'styled-components'
import {CodeInputLanguage, CodeInputValue, CodeSchemaType} from './types'
import {PATH_CODE} from './config'
import {useCodeMirror} from './codemirror/useCodeMirror'
import {useLanguageMode} from './codemirror/useLanguageMode'

export type {CodeInputLanguage, CodeInputValue} from './types'

const EditorContainer = styled(Card)`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 0;

  resize: vertical;
  height: 250px;
  overflow-y: auto;
`

/**
 * @public
 */
export type CodeInputProps = ObjectInputProps<CodeInputValue, CodeSchemaType> & {
  /** @internal */
  colorScheme?: ThemeColorSchemeKey
}

export function CodeInput(props: CodeInputProps) {
  const {
    members,
    elementProps,
    onChange,
    readOnly,
    renderField,
    renderInput,
    renderItem,
    renderPreview,
    schemaType: type,
    value,
    onPathFocus,
  } = props

  const languageFieldMember = useFieldMember(members, 'language')
  const filenameMember = useFieldMember(members, 'filename')
  const codeFieldMember = useFieldMember(members, 'code')

  const handleCodeFocus = useCallback(() => {
    onPathFocus(PATH_CODE)
  }, [onPathFocus])

  const onHighlightChange = useCallback(
    (lines: number[]) => onChange(set(lines, ['highlightedLines'])),
    [onChange]
  )

  const handleCodeChange = useCallback(
    (code: string) => {
      const path = PATH_CODE
      const fixedLanguage = type.options?.language

      onChange([
        setIfMissing({_type: type.name, language: fixedLanguage}),
        code ? set(code, path) : unset(path),
      ])
    },
    [onChange, type]
  )
  const {languages, language, languageMode} = useLanguageMode(props.schemaType, props.value)

  const CodeMirror = useCodeMirror()

  const renderCodeInput: RenderInputCallback = useCallback(
    (inputProps) => {
      return (
        <EditorContainer radius={1} shadow={1} readOnly={readOnly}>
          {CodeMirror && (
            <Suspense fallback={<Card padding={2}>Loading code editor...</Card>}>
              <CodeMirror
                languageMode={languageMode}
                onChange={handleCodeChange}
                value={inputProps.value as string}
                highlightLines={value?.highlightedLines}
                onHighlightChange={onHighlightChange}
                readOnly={readOnly}
                onFocus={handleCodeFocus}
                onBlur={elementProps.onBlur}
              />
            </Suspense>
          )}
        </EditorContainer>
      )
    },
    [
      CodeMirror,
      handleCodeChange,
      handleCodeFocus,
      onHighlightChange,
      languageMode,
      elementProps.onBlur,
      readOnly,
      value,
    ]
  )

  return (
    <Stack space={4}>
      {languageFieldMember && (
        <LanguageField
          {...props}
          member={languageFieldMember}
          language={language}
          languages={languages}
        />
      )}

      {type.options?.withFilename && filenameMember && (
        <MemberField
          member={filenameMember}
          renderItem={renderItem}
          renderField={renderField}
          renderInput={renderInput}
          renderPreview={renderPreview}
        />
      )}

      {codeFieldMember && (
        <MemberField
          member={codeFieldMember}
          renderInput={renderCodeInput}
          renderItem={renderItem}
          renderField={renderField}
          renderPreview={renderPreview}
        />
      )}
    </Stack>
  )
}

function LanguageField(
  props: CodeInputProps & {member: FieldMember; languages: CodeInputLanguage[]; language: string}
) {
  const {member, languages, language, renderItem, renderField, renderPreview} = props
  const renderLanguageInput = useCallback(
    (inputProps: Omit<InputProps, 'renderDefault'>) => {
      return (
        <Select
          {...(inputProps as StringInputProps)}
          value={language}
          onChange={(e) => {
            const newValue = e.currentTarget.value
            inputProps.onChange(newValue ? set(newValue) : unset())
          }}
        >
          {languages.map((lang: {title: string; value: string}) => (
            <option key={lang.value} value={lang.value}>
              {lang.title}
            </option>
          ))}
        </Select>
      )
    },
    [languages, language]
  )

  return (
    <MemberField
      member={member}
      renderItem={renderItem}
      renderField={renderField}
      renderInput={renderLanguageInput}
      renderPreview={renderPreview}
    />
  )
}

function useFieldMember(members: ObjectMember[], fieldName: string) {
  return useMemo(
    () =>
      members.find(
        (member): member is FieldMember => member.kind === 'field' && member.name === fieldName
      ),
    [members, fieldName]
  )
}
