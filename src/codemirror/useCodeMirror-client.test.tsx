/** @jest-environment jsdom */

import {Suspense} from 'react'

import {act, render} from '@testing-library/react'
import {useCodeMirror} from './useCodeMirror'
import {studioTheme, ThemeProvider} from '@sanity/ui'

describe('useCodeMirror - client', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => {
        try {
          // eslint-disable-next-line callback-return
          callback(0)
        } catch (e) {
          // CodeMirror does some mesurement shenanigance that json dont support
          // we just let it crash silently
        }
        return 0
      })
  })

  afterEach(() => {
    ;(window.requestAnimationFrame as any).mockRestore()
  })

  it('should render suspended ace editor', async () => {
    const TestComponent = () => {
      const CodeMirror = useCodeMirror()
      return (
        <Suspense fallback={'loading'}>
          {CodeMirror && (
            <ThemeProvider theme={studioTheme}>
              <CodeMirror languageMode={'tsx'} />
            </ThemeProvider>
          )}
        </Suspense>
      )
    }
    let container: any
    await act(async () => {
      const result = render(<TestComponent />)
      container = result.container
    })
    expect(container.querySelector('.cm-theme')).toBeTruthy()
  })
})
