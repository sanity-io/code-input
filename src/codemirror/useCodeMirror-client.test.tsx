/** @jest-environment jsdom */
import React, {Suspense} from 'react'

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
              <CodeMirror />
            </ThemeProvider>
          )}
        </Suspense>
      )
    }
    const {container} = render(<TestComponent />)

    expect(container.innerHTML).toEqual(fallbackString)

    await waitForElementToBeRemoved(() => queryByText(container, fallbackString))

    // note: ace will console.error log when mounting
    expect(container.querySelector('.ace_editor')).toBeDefined()
  })
})
