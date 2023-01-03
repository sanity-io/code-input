import React, {Suspense, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Box, Card} from '@sanity/ui'
import {CodeInputValue} from './types'
import {PreviewProps} from 'sanity'
import {useCodeMirror} from './codemirror/useCodeMirror'

const PreviewContainer = styled(Box)`
  position: relative;
`

/**
 * @public
 */
export interface PreviewCodeProps extends PreviewProps {
  selection?: CodeInputValue
}

/**
 * @public
 */
export default function PreviewCode(props: PreviewCodeProps) {
  const aceEditorRef = useRef<any>()

  useEffect(() => {
    if (!aceEditorRef?.current) return

    const editor = aceEditorRef.current?.editor

    if (editor) {
      // Avoid cursor and focus tracking by Ace
      editor.renderer.$cursorLayer.element.style.opacity = 0
      editor.textInput.getElement().disabled = true
    }
  }, [])

  const {selection, schemaType: type} = props
  const fixedLanguage = type?.options?.language

  const language = selection?.language || fixedLanguage || 'text'

  const CodeMirror = useCodeMirror()
  return (
    <PreviewContainer>
      <Card padding={4}>
        {CodeMirror && (
          <Suspense fallback={<Card padding={2}>Loading code preview...</Card>}>
            <CodeMirror
              ref={aceEditorRef}
              readOnly
              editable={false}
              value={selection?.code || ''}
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightSelectionMatches: false,
                highlightActiveLineGutter: false,
                highlightActiveLine: false,
              }}
              languageMode={language}

              /*      markers={
                selection?.highlightedLines
                  ? createHighlightMarkers(selection.highlightedLines)
                  : undefined
              }*/
            />
          </Suspense>
        )}
      </Card>
    </PreviewContainer>
  )
}
