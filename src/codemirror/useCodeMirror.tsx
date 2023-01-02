import React, {useEffect, useState} from 'react'

export const CodeMirrorProxy = React.lazy(() => import('./CodeMirrorProxy'))

export function useCodeMirror() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  return mounted ? CodeMirrorProxy : null
}
