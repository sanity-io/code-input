import {Box, Card, Flex, Label, Text} from '@sanity/ui'
import {Suspense} from 'react'
import {PreviewProps} from 'sanity'
import styled from 'styled-components'

import {useCodeMirror} from './codemirror/useCodeMirror'
import {useLanguageMode} from './codemirror/useLanguageMode'
import {CodeInputValue, CodeSchemaType} from './types'

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
export function PreviewCode(props: PreviewCodeProps) {
  const {selection, schemaType: type} = props
  const {languageMode} = useLanguageMode(type as CodeSchemaType, props.selection)

  const CodeMirror = useCodeMirror()
  return (
    <PreviewContainer>
      <Card padding={4}>
        {selection?.filename || selection?.language ? (
          <Card
            paddingBottom={4}
            marginBottom={selection.code ? 4 : 0}
            borderBottom={!!selection.code}
          >
            <Flex align="center" justify="flex-end">
              {selection?.filename ? (
                <Box flex={1}>
                  <Text>
                    <code>{selection.filename}</code>
                  </Text>
                </Box>
              ) : null}
              {selection?.language ? <Label muted>{selection.language}</Label> : null}
            </Flex>
          </Card>
        ) : null}
        {CodeMirror && (
          <Suspense fallback={<Card padding={2}>Loading code preview...</Card>}>
            <CodeMirror
              readOnly
              editable={false}
              value={selection?.code || ''}
              highlightLines={selection?.highlightedLines || []}
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
