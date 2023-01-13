import {renderToString} from 'react-dom/server'
import {useCodeMirror} from './useCodeMirror'

describe('useCodeMirror - server', () => {
  it('should render null to string (and not throw and Error)', () => {
    const TestComponent = () => {
      const Editor = useCodeMirror()
      if (!Editor) {
        return null
      }
      throw new Error('editor should always be null in envs without window')
    }
    const serverString = renderToString(<TestComponent />)

    expect(serverString).toEqual('')
  })
})
