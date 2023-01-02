/* eslint-disable react/jsx-handler-names */
import React, {Suspense, useCallback, useMemo} from 'react'
import {
  FieldMember,
  InputProps,
  MemberField,
  ObjectInputProps,
  ObjectMember,
  ObjectSchemaType,
  RenderInputCallback,
  set,
  setIfMissing,
  StringInputProps,
  unset,
} from 'sanity'
import {Card, Select, Stack, ThemeColorSchemeKey} from '@sanity/ui'
import styled from 'styled-components'
import {CodeInputLanguage, CodeInputValue} from './types'
import {LANGUAGE_ALIASES, PATH_CODE, SUPPORTED_LANGUAGES} from './config'
import {useCodeMirror} from './codemirror/useCodeMirror'

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
const defaultMode = 'text'

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
export type CodeSchemaType = Omit<ObjectSchemaType, 'options'> & {
  options?: CodeOptions
}

/**
 * @public
 */
export type CodeInputProps = ObjectInputProps<CodeInputValue, CodeSchemaType> & {
  /** @internal */
  colorScheme?: ThemeColorSchemeKey
}

function resolveAliasedLanguage(lang?: string) {
  return (lang && LANGUAGE_ALIASES[lang]) ?? lang
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
  const languages = useLanguageAlternatives(props.schemaType)
  const fixedLanguage = type.options?.language
  const language = value?.language || fixedLanguage

  // the language config from the schema
  const configured = languages.find((entry) => entry.value === language)

  const mode = configured?.mode ?? resolveAliasedLanguage(language) ?? defaultMode

  const CodeMirror = useCodeMirror()

  const renderCodeInput: RenderInputCallback = useCallback(
    (inputProps) => {
      return (
        <EditorContainer radius={1} shadow={1} readOnly={readOnly}>
          {CodeMirror && (
            <Suspense fallback={<Card padding={2}>Loading code editor...</Card>}>
              <CodeMirror
                mode={mode}
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
      mode,
      elementProps.onBlur,
      readOnly,
      value,
    ]
  )

  return (
    <Stack space={4}>
      {languageFieldMember && (
        <LanguageField {...props} member={languageFieldMember} languages={languages} />
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
  props: CodeInputProps & {member: FieldMember; languages: CodeInputLanguage[]}
) {
  const {member, languages, renderItem, renderField, renderPreview} = props
  const renderLanguageInput = useCallback(
    (inputProps: Omit<InputProps, 'renderDefault'>) => {
      return (
        <Select
          {...(inputProps as StringInputProps)}
          value={(inputProps as StringInputProps).value ?? defaultMode}
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
    [languages]
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

function useLanguageAlternatives(type: CodeSchemaType) {
  return useMemo((): CodeInputLanguage[] => {
    const languageAlternatives = type.options?.languageAlternatives
    if (!languageAlternatives) {
      return SUPPORTED_LANGUAGES
    }

    if (!Array.isArray(languageAlternatives)) {
      throw new Error(
        `'options.languageAlternatives' should be an array, got ${typeof languageAlternatives}`
      )
    }

    return languageAlternatives.reduce((acc: CodeInputLanguage[], {title, value: val, mode}) => {
      const alias = LANGUAGE_ALIASES[val]
      if (alias) {
        // eslint-disable-next-line no-console
        console.warn(
          `'options.languageAlternatives' lists a language with value "%s", which is an alias of "%s" - please replace the value to read "%s"`,
          val,
          alias,
          alias
        )

        return acc.concat({title, value: alias, mode: mode})
      }
      return acc.concat({title, value: val, mode})
    }, [])
  }, [type])
}
