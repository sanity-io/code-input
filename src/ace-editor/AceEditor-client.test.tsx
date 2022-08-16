/** @jest-environment jsdom */
import React, {Suspense} from 'react'

import {queryByText, render, waitForElementToBeRemoved} from '@testing-library/react'
import {useAceEditor} from './AceEditorLazy'

describe('AceEditor - client', () => {
  it('should render suspended ace editor', async () => {
    const fallbackString = 'loading'

    const TestComponent = () => {
      const AceEditor = useAceEditor()
      return <Suspense fallback={fallbackString}>{AceEditor && <AceEditor />}</Suspense>
    }
    const {container} = render(<TestComponent />)

    expect(container.innerHTML).toEqual(fallbackString)

    await waitForElementToBeRemoved(() => queryByText(container, fallbackString))

    // note: ace will console.error log when mounting
    expect(container.querySelector('.ace_editor')).toBeDefined()
  })
})
