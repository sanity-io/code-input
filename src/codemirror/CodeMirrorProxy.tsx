import React, {forwardRef, useContext, useEffect, useMemo, useState} from 'react'
import CodeMirror, {ReactCodeMirrorProps, ReactCodeMirrorRef} from '@uiw/react-codemirror'
import {useCodeMirrorTheme} from './useCodeMirrorTheme'
import {Extension} from '@codemirror/state'
import {CodeInputConfigContext} from './CodeModeContext'
import {defaultCodeModes} from './defaultCodeModes'
import {highlightLine, highlightState, setHighlightedLines} from './highlightLineExtension'
import {EditorView} from '@codemirror/view'

export interface CodeMirrorProps extends ReactCodeMirrorProps {
  mode?: string
  highlightLines?: number[]
  onHighlightChange?: (lines: number[]) => void
}

/**
 * CodeMirrorProxy is a wrapper component around CodeMirror that we lazy load to reduce initial bundle size.
 *
 * It is also responsible for integrating any CodeMirror extensions.
 */
const CodeMirrorProxy = forwardRef<ReactCodeMirrorRef, CodeMirrorProps>((props, ref) => {
  const {value, mode, onHighlightChange, highlightLines, ...codeMirrorProps} = props
  const theme = useCodeMirrorTheme()
  const [editorView, setEditorView] = useState<EditorView | undefined>(undefined)
  const codeConfig = useContext(CodeInputConfigContext)

  const [languageExtension, setLanguageExtension] = useState<Extension | undefined>()

  useEffect(() => {
    const customModes = codeConfig?.codeModes ?? []
    const modes = [...customModes, ...defaultCodeModes]

    const codeMode = modes.find((m) => m.name === mode)
    if (!codeMode?.loader) {
      console.warn(
        `Found no codeMode for language mode ${mode}, syntax highlighting will be disabled.`
      )
    }
    let active = true
    Promise.resolve(codeMode?.loader())
      .then((extension) => {
        if (active) {
          setLanguageExtension(extension)
        }
      })
      .catch((e) => {
        console.error(`Failed to load language mode ${mode}`, e)
        if (active) {
          setLanguageExtension(undefined)
        }
      })
    return () => {
      active = false
    }
  }, [mode, codeConfig])

  const extensions = useMemo(() => {
    const baseExtensions = [
      highlightLine({
        onHighlightChange,
      }),
    ]
    if (languageExtension) {
      return [...baseExtensions, languageExtension]
    }
    return baseExtensions
  }, [onHighlightChange, languageExtension])

  useEffect(() => {
    if (editorView) {
      setHighlightedLines(editorView, highlightLines ?? [])
    }
  }, [editorView, highlightLines, value])

  const initialState = useMemo(() => {
    return {
      json: {
        doc: value ?? '',
        selection: {
          main: 0,
          ranges: [{anchor: 0, head: 0}],
        },
        highlight: highlightLines ?? [],
      },
      fields: highlightState,
    }
    // only need to calculate this on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CodeMirror
      {...codeMirrorProps}
      value={value}
      ref={ref}
      extensions={extensions}
      theme={theme}
      onCreateEditor={(view: EditorView) => {
        setEditorView(view)
      }}
      initialState={initialState}
    />
  )
})

export default CodeMirrorProxy
