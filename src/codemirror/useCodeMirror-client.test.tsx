/** @jest-environment jsdom */

import {studioTheme, ThemeProvider} from '@sanity/ui'
import {act, render} from '@testing-library/react'
import {Suspense} from 'react'

import {CodeMirrorProxy, useMounted} from './useCodeMirror'

describe('useCodeMirror - client', () => {
  let rafMock: jest.SpyInstance<number, [FrameRequestCallback]>

  beforeEach(() => {
    rafMock = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => {
        try {
          callback(0)
        } catch {
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
      const mounted = useMounted()
      return (
        <Suspense fallback={'loading'}>
          {mounted && (
            <ThemeProvider theme={studioTheme}>
              <CodeMirrorProxy languageMode={'tsx'} />
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
