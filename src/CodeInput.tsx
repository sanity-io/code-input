import {Suspense, useCallback} from 'react'
import {MemberField, ObjectInputProps, RenderInputCallback, set, setIfMissing, unset} from 'sanity'
import {Card, Stack} from '@sanity/ui'
import styled, {css} from 'styled-components'
import {LanguageField} from './LanguageField'
import {useCodeMirror} from './codemirror/useCodeMirror'
import {useLanguageMode} from './codemirror/useLanguageMode'
import {PATH_CODE} from './config'
import {CodeInputValue, CodeSchemaType} from './types'
import {useFieldMember} from './useFieldMember'
import {focusRingBorderStyle, focusRingStyle} from './ui/focusRingStyle'

export type {CodeInputLanguage, CodeInputValue} from './types'

/**
 * @public
 */
export interface CodeInputProps extends ObjectInputProps<CodeInputValue, CodeSchemaType> {}

const EditorContainer = styled(Card)(({theme}) => {
  const {focusRing, input} = theme.sanity
  const base = theme.sanity.color.base
  const color = theme.sanity.color.input
  const border = {
    color: color.default.enabled.border,
    width: input.border.width,
  }

  return css`
    --input-box-shadow: ${focusRingBorderStyle(border)};

    box-shadow: var(--input-box-shadow);
    height: 250px;
    min-height: 80px;
    overflow-y: auto;
    position: relative;
    resize: vertical;
    z-index: 0;

    & > .cm-theme {
      height: 100%;
    }

    &:focus-within {
      --input-box-shadow: ${focusRingStyle({
        base,
        border,
        focusRing,
      })};
    }
  `
})

/** @public */
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
          member={languageFieldMember}
          language={language}
          languages={languages}
          renderField={renderField}
          renderItem={renderItem}
          renderInput={renderInput}
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
