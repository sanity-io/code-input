import React, {Suspense, useCallback, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Box} from '@sanity/ui'
import {ACE_EDITOR_PROPS, ACE_SET_OPTIONS} from './config'
import createHighlightMarkers from './createHighlightMarkers'
import {CodeInputValue} from './types'
import {useAceEditor} from './ace-editor/AceEditorLazy'
import {CodeSchemaType} from './CodeInput'

const PreviewContainer = styled(Box)`
  position: relative;
`

const PreviewInner = styled(Box)`
  background-color: #272822;

  .ace_editor {
    box-sizing: border-box;
    cursor: default;
    pointer-events: none;
  }

  .ace_content {
    box-sizing: border-box;
    overflow: hidden;
  }
`

/**
 * @public
 */
export interface PreviewCodeProps {
  type?: CodeSchemaType
  value?: {selection?: CodeInputValue}
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

  const handleEditorChange = useCallback(() => {
    // do nothing when the editor changes
  }, [])

  const {value, type} = props
  const fixedLanguage = type?.options?.language

  const selection = value?.selection
  const mode = selection?.language || fixedLanguage || 'text'

  const AceEditor = useAceEditor()
  return (
    <PreviewContainer>
      <PreviewInner padding={4}>
        {AceEditor && (
          <Suspense fallback={<div>Loading code preview...</div>}>
            <AceEditor
              ref={aceEditorRef}
              focus={false}
              mode={mode}
              theme="monokai"
              width="100%"
              onChange={handleEditorChange}
              maxLines={200}
              readOnly
              wrapEnabled
              showPrintMargin={false}
              highlightActiveLine={false}
              cursorStart={-1}
              value={selection?.code || ''}
              markers={
                selection?.highlightedLines
                  ? createHighlightMarkers(selection.highlightedLines)
                  : undefined
              }
              tabSize={2}
              showGutter={false}
              setOptions={ACE_SET_OPTIONS}
              editorProps={ACE_EDITOR_PROPS}
            />
          </Suspense>
        )}
      </PreviewInner>
    </PreviewContainer>
  )
}
