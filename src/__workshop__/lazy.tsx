import {Box, Card, Container, Text} from '@sanity/ui'
import {Suspense, useState} from 'react'
import {useCodeMirror} from '../codemirror/useCodeMirror'
import {SUPPORTED_LANGUAGES} from '../config'
import {useSelect} from '@sanity/ui-workshop'
import styled from 'styled-components'

const langs = {
  ...Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l.title, l.mode ?? l.value])),
  'Not supported': 'not-supported',
}

const defaultSnippet = `
<Card border padding={2}>
  {variable}
</Card>
`.trim()

const Root = styled(Card)`
  & > .cm-theme {
    height: 100%;
  }
`

export default function CodeMirrorStory() {
  const language = useSelect('Language mode', langs, 'tsx')
  const [code, setCode] = useState(defaultSnippet)
  const [highlights, setHighlights] = useState<number[]>([])
  const CodeMirror = useCodeMirror()

  return (
    <Container padding={4} sizing="border" width={1}>
      <Root border overflow="hidden" radius={3} style={{height: 300}}>
        {CodeMirror && (
          <Suspense
            fallback={
              <Box padding={3}>
                <Text>Loading code editor...</Text>
              </Box>
            }
          >
            <CodeMirror
              value={code}
              onChange={setCode}
              highlightLines={highlights}
              onHighlightChange={setHighlights}
              languageMode={language}
            />
          </Suspense>
        )}
      </Root>
    </Container>
  )
}
