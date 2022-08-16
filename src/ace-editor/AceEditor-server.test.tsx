import React from 'react'
import {renderToString} from 'react-dom/server'
import {useAceEditor} from './AceEditorLazy'

describe('AceEditor - server', () => {
  it('should render null to string (and not throw and Error)', () => {
    const TestComponent = () => {
      const Editor = useAceEditor()
      if (!Editor) {
        return null
      }
      throw new Error('editor should always be null in envs without window')
    }
    const serverString = renderToString(<TestComponent />)

    expect(serverString).toEqual('')
  })
})
