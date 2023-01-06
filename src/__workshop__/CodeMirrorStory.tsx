import {Card, Container} from '@sanity/ui'
import React, {Suspense, useState} from 'react'
import {useCodeMirror} from '../codemirror/useCodeMirror'
import {SUPPORTED_LANGUAGES} from '../config'
import {useSelect} from '@sanity/ui-workshop'

const langs = {
  ...Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l.title, l.mode ?? l.value])),
  'Not supported': 'not-supported',
}

const defaultSnippet = `
<Card border padding={2}>
 {variable}
</Card>
`

export default function CodeMirrorStory() {
  const language = useSelect('Language mode', langs, 'tsx')
  const [code, setCode] = useState(defaultSnippet)
  const [highlights, setHighlights] = useState<number[]>([])

  const CodeMirror = useCodeMirror()
  return (
    <Container width={1}>
      <Card margin={4} border>
        {CodeMirror && (
          <Suspense fallback={<Card padding={2}>Loading code editor...</Card>}>
            <CodeMirror
              value={code}
              onChange={setCode}
              highlightLines={highlights}
              onHighlightChange={setHighlights}
              languageMode={language}
            />
          </Suspense>
        )}
      </Card>
    </Container>
  )
}
