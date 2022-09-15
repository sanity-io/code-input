import React, {useEffect, useState} from 'react'

/**
 * AceEditor loads window global directly when imported, which crashes in node envs.
 * This works around the issue by only importing ace-dependencies when window is defined.
 *
 * We only set the ace lazy component after mounting, to allow us to render null on the server,
 * and use suspense on the client. This will make hydration work correctly.
 */
export const AceEditorLazy = React.lazy(() => import('./editorSupport'))

export function useAceEditor() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  return mounted ? AceEditorLazy : null
}
