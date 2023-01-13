/** @jest-environment jsdom */

import {Suspense} from 'react'

import {queryByText, render, waitForElementToBeRemoved} from '@testing-library/react'
import {useCodeMirror} from './useCodeMirror'
import {studioTheme, ThemeProvider} from '@sanity/ui'

describe('useCodeMirror - client', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0)
        return 0
      })
  })

  afterEach(() => {
    ;(window.requestAnimationFrame as any).mockRestore()
  })

  it('should render suspended ace editor', async () => {
    const fallbackString = 'loading'

    const TestComponent = () => {
      const CodeMirror = useCodeMirror()
      return (
        <Suspense fallback={fallbackString}>
          {CodeMirror && (
            <ThemeProvider theme={studioTheme}>
              <CodeMirror languageMode={'tsx'} />
            </ThemeProvider>
          )}
        </Suspense>
      )
    }
    const {container} = render(<TestComponent />)

    expect(container.innerHTML).toEqual(fallbackString)

    await waitForElementToBeRemoved(() => queryByText(container, fallbackString))

    expect(container.querySelector('.cm-theme')).toBeTruthy()
  })
})
