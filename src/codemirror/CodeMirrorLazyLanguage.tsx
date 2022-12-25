import React, {forwardRef, useContext, useEffect, useMemo, useState} from 'react'
import CodeMirror, {ReactCodeMirrorProps, ReactCodeMirrorRef} from '@uiw/react-codemirror'
import {useCodeMirrorTheme} from './useCodeMirrorTheme'
import {Extension} from '@codemirror/state'
import {CodeInputConfigContext} from './CodeModeContext'
import {defaultCodeModes} from './defaultCodeModes'

export interface CodeMirrorProps extends ReactCodeMirrorProps {
  mode?: string
}

const CodeMirrorLazyLanguage = forwardRef<ReactCodeMirrorRef, CodeMirrorProps>((props, ref) => {
  const {mode} = props
  const theme = useCodeMirrorTheme()
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
    const baseExtensions: Extension[] = []
    if (languageExtension) {
      return [...baseExtensions, languageExtension]
    }
    return baseExtensions
  }, [languageExtension])

  return <CodeMirror {...props} ref={ref} extensions={extensions} theme={theme} />
})

export default CodeMirrorLazyLanguage
