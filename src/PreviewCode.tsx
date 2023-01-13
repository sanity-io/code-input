import {Suspense} from 'react'
import styled from 'styled-components'
import {Box, Card} from '@sanity/ui'
import {CodeInputValue, CodeSchemaType} from './types'
import {PreviewProps} from 'sanity'
import {useCodeMirror} from './codemirror/useCodeMirror'
import {useLanguageMode} from './codemirror/useLanguageMode'

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
  const {selection, schemaType: type} = props
  const {languageMode} = useLanguageMode(type as CodeSchemaType, props.selection)

  const CodeMirror = useCodeMirror()
  return (
    <PreviewContainer>
      <Card padding={4}>
        {CodeMirror && (
          <Suspense fallback={<Card padding={2}>Loading code preview...</Card>}>
            <CodeMirror
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
              languageMode={languageMode}
            />
          </Suspense>
        )}
      </Card>
    </PreviewContainer>
  )
}
