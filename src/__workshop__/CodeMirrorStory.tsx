import {Card, Container} from '@sanity/ui'
import {useString} from '@sanity/ui-workshop'
import React, {Suspense, useState} from 'react'
import {useCodeMirror} from '../codemirror/useCodeMirror'

export default function CodeMirrorStory() {
  const language = useString('Language mode', 'tsx')

  // this does not currently work (react update depth error)
  /*  const language = useSelect(
    'Language mode',
    Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l.mode ?? l.value])),
    'text'
  )*/
  const [code, setCode] = useState('')
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
