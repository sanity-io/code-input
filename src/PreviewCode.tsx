import {Box, Card, Flex, Label, Text} from '@sanity/ui'
import {Suspense} from 'react'
import type {PreviewProps} from 'sanity'
import {styled} from 'styled-components'

import {CodeMirrorProxy, useMounted} from './codemirror/useCodeMirror'
import {useLanguageMode} from './codemirror/useLanguageMode'
import type {CodeInputValue, CodeSchemaType} from './types'

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

  const mounted = useMounted()
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
        {mounted && (
          <Suspense fallback={<Card padding={2}>Loading code preview...</Card>}>
            <CodeMirrorProxy
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
