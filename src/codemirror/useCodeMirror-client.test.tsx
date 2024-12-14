/** @jest-environment jsdom */

import {studioTheme, ThemeProvider} from '@sanity/ui'
import {act, render} from '@testing-library/react'
import {Suspense} from 'react'

import {useCodeMirror} from './useCodeMirror'

describe('useCodeMirror - client', () => {
  let rafMock: jest.SpyInstance<number, [FrameRequestCallback]>

  beforeEach(() => {
    rafMock = jest
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
    rafMock.mockRestore()
  })

  it('should render suspended codemirror editor', async () => {
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
    let container: HTMLElement | undefined
    await act(async () => {
      const result = render(<TestComponent />)
      container = result.container
    })
    expect(container).toBeTruthy()
    expect(container!.querySelector('.cm-theme')).toBeTruthy()
  })
})
