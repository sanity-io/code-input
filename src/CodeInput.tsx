/* eslint-disable react/jsx-handler-names */
import React, {Suspense, useCallback, useEffect, useMemo, useRef} from 'react'
import {
  FieldMember,
  InputProps,
  MemberField,
  ObjectInputProps,
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

  const editorRef = useRef<any>()

  const fieldMembers = useMemo(
    () => members.filter((member) => member.kind === 'field') as FieldMember[],
    [members]
  )

  const languageFieldMember = fieldMembers.find((member) => member.name === 'language')
  const filenameMember = fieldMembers.find((member) => member.name === 'filename')
  const codeFieldMember = fieldMembers.find((member) => member.name === 'code')

  const handleCodeFocus = useCallback(() => {
    onPathFocus(PATH_CODE)
  }, [onPathFocus])

  const handleToggleSelectLine = useCallback(
    (lineNumber: number) => {
      const editorSession = editorRef.current?.editor?.getSession()
      const backgroundMarkers = editorSession?.getMarkers(true)
      const currentHighlightedLines = Object.keys(backgroundMarkers)
        .filter((key) => backgroundMarkers[key].type === 'screenLine')
        .map((key) => backgroundMarkers[key].range.start.row)
      const currentIndex = currentHighlightedLines.indexOf(lineNumber)
      if (currentIndex > -1) {
        // toggle remove
        currentHighlightedLines.splice(currentIndex, 1)
      } else {
        // toggle add
        currentHighlightedLines.push(lineNumber)
        currentHighlightedLines.sort()
      }
      onChange(
        set(
          currentHighlightedLines.map(
            (line) =>
              // ace starts at line (row) 0, but we store it starting at line 1
              line + 1
          ),
          ['highlightedLines']
        )
      )
    },
    [editorRef, onChange]
  )

  const handleGutterMouseDown = useCallback(
    (event: any) => {
      const target = event.domEvent.target
      if (target.classList.contains('ace_gutter-cell')) {
        const row = event.getDocumentPosition().row
        handleToggleSelectLine(row)
      }
    },
    [handleToggleSelectLine]
  )

  useEffect(() => {
    const editor = editorRef?.current?.editor
    return () => {
      editor?.session?.removeListener('guttermousedown', handleGutterMouseDown)
    }
  }, [editorRef, handleGutterMouseDown])

  const handleEditorLoad = useCallback(
    (editor: any) => {
      editor?.on('guttermousedown', handleGutterMouseDown)
    },
    [handleGutterMouseDown]
  )

  const getLanguageAlternatives = useCallback((): CodeInputLanguage[] => {
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

  const languages = getLanguageAlternatives().slice()

  const fixedLanguage = type.options?.language

  const language = value?.language || fixedLanguage

  // the language config from the schema
  const configured = languages.find((entry) => entry.value === language)

  const mode = configured?.mode ?? resolveAliasedLanguage(language) ?? 'text'

  const renderLanguageInput = useCallback(
    (inputProps: Omit<InputProps, 'renderDefault'>) => {
      return (
        <Select
          {...(inputProps as StringInputProps)}
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

  const CodeMirror = useCodeMirror()

  const renderCodeInput: RenderInputCallback = useCallback(
    (inputProps) => {
      return (
        <EditorContainer radius={1} shadow={1} readOnly={readOnly}>
          {CodeMirror && (
            <Suspense fallback={<Card padding={2}>Loading code editor...</Card>}>
              <CodeMirror
                mode={mode}
                ref={editorRef}
                onChange={handleCodeChange}
                value={inputProps.value as string}
                /*       markers={
                  value && value.highlightedLines
                    ? createHighlightMarkers(value.highlightedLines)
                    : undefined
                }*/
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
      handleEditorLoad,
      mode,
      elementProps.onBlur,
      readOnly,
      value,
    ]
  )

  return (
    <Stack space={4}>
      {languageFieldMember && (
        <MemberField
          member={languageFieldMember}
          renderItem={renderItem}
          renderField={renderField}
          renderInput={renderLanguageInput}
          renderPreview={renderPreview}
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
