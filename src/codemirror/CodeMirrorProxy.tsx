import {forwardRef, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import CodeMirror, {ReactCodeMirrorProps, ReactCodeMirrorRef} from '@uiw/react-codemirror'
import {useCodeMirrorTheme} from './extensions/useCodeMirrorTheme'
import {Extension} from '@codemirror/state'
import {CodeInputConfigContext} from './CodeModeContext'
import {defaultCodeModes} from './defaultCodeModes'
import {
  highlightLine,
  highlightState,
  setHighlightedLines,
} from './extensions/highlightLineExtension'
import {EditorView} from '@codemirror/view'
import {useRootTheme} from '@sanity/ui'
import {useFontSizeExtension} from './extensions/useFontSize'
import {useThemeExtension} from './extensions/theme'

export interface CodeMirrorProps extends ReactCodeMirrorProps {
  highlightLines?: number[]
  languageMode?: string
  onHighlightChange?: (lines: number[]) => void
}

/**
 * CodeMirrorProxy is a wrapper component around CodeMirror that we lazy load to reduce initial bundle size.
 *
 * It is also responsible for integrating any CodeMirror extensions.
 */
const CodeMirrorProxy = forwardRef<ReactCodeMirrorRef, CodeMirrorProps>(function CodeMirrorProxy(
  props,
  ref
) {
  const {
    basicSetup: basicSetupProp,
    highlightLines,
    languageMode,
    onHighlightChange,
    readOnly,
    value,
    ...codeMirrorProps
  } = props

  const themeCtx = useRootTheme()
  const codeMirrorTheme = useCodeMirrorTheme()
  const [editorView, setEditorView] = useState<EditorView | undefined>(undefined)

  // Resolve extensions
  const themeExtension = useThemeExtension()
  const fontSizeExtension = useFontSizeExtension({fontSize: 1})
  const languageExtension = useLanguageExtension(languageMode)
  const highlightLineExtension = useMemo(
    () =>
      highlightLine({
        onHighlightChange,
        readOnly,
        theme: themeCtx,
      }),
    [onHighlightChange, readOnly, themeCtx]
  )

  const extensions = useMemo(() => {
    const baseExtensions = [
      themeExtension,
      fontSizeExtension,
      highlightLineExtension,
      EditorView.lineWrapping,
    ]
    if (languageExtension) {
      return [...baseExtensions, languageExtension]
    }
    return baseExtensions
  }, [fontSizeExtension, highlightLineExtension, languageExtension, themeExtension])

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

  const handleCreateEditor = useCallback((view: EditorView) => {
    setEditorView(view)
  }, [])

  const basicSetup = useMemo(
    () =>
      basicSetupProp ?? {
        highlightActiveLine: false,
      },
    [basicSetupProp]
  )

  return (
    <CodeMirror
      {...codeMirrorProps}
      value={value}
      ref={ref}
      extensions={extensions}
      theme={codeMirrorTheme}
      onCreateEditor={handleCreateEditor}
      initialState={initialState}
      basicSetup={basicSetup}
    />
  )
})

function useLanguageExtension(mode?: string) {
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

  return languageExtension
}

export default CodeMirrorProxy
