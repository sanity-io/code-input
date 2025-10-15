import {lazy, startTransition, useEffect, useState} from 'react'

export const CodeMirrorProxy = lazy(() => import('./CodeMirrorProxy'))

export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => startTransition(() => setMounted(true)))
  }, [])
  return mounted
}
