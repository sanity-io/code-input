import React, {useEffect, useState} from 'react'

export const CodeMirrorLazyLanguage = React.lazy(() => import('./CodeMirrorLazyLanguage'))

export function useCodeMirror() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  return mounted ? CodeMirrorLazyLanguage : null
}
