import type {Extension} from '@codemirror/state'
import {EditorView} from '@codemirror/view'
import {useRootTheme} from '@sanity/ui'
import {rgba} from '@sanity/ui/theme'
import {useMemo} from 'react'

import {getBackwardsCompatibleTone} from './backwardsCompatibleTone'

export function useThemeExtension(): Extension {
  const themeCtx = useRootTheme()

  return useMemo(() => {
    const fallbackTone = getBackwardsCompatibleTone(themeCtx)
    const dark = {color: themeCtx.theme.color.dark[fallbackTone]}
    const light = {color: themeCtx.theme.color.light[fallbackTone]}

    return EditorView.baseTheme({
      '&.cm-editor': {
        height: '100%',
      },
      '&.cm-editor.cm-focused': {
        outline: 'none',
      },

      // Matching brackets
      '&.cm-editor.cm-focused .cm-matchingBracket': {
        backgroundColor: 'transparent',
      },
      '&.cm-editor.cm-focused .cm-nonmatchingBracket': {
        backgroundColor: 'transparent',
      },
      '&dark.cm-editor.cm-focused .cm-matchingBracket': {
        outline: `1px solid ${dark.color.base.border}`,
      },
      '&dark.cm-editor.cm-focused .cm-nonmatchingBracket': {
        outline: `1px solid ${dark.color.base.border}`,
      },
      '&light.cm-editor.cm-focused .cm-matchingBracket': {
        outline: `1px solid ${light.color.base.border}`,
      },
      '&light.cm-editor.cm-focused .cm-nonmatchingBracket': {
        outline: `1px solid ${light.color.base.border}`,
      },

      // Size and padding of gutter
      '& .cm-lineNumbers .cm-gutterElement': {
        minWidth: `32px !important`,
        padding: `0 8px !important`,
      },
      '& .cm-gutter.cm-foldGutter': {
        width: `0px !important`,
      },

      // Color of gutter
      '&dark .cm-gutters': {
        color: `${rgba(dark.color.card.enabled.code.fg, 0.5)} !important`,
        borderRight: `1px solid ${rgba(dark.color.base.border, 0.5)}`,
      },
      '&light .cm-gutters': {
        color: `${rgba(light.color.card.enabled.code.fg, 0.5)} !important`,
        borderRight: `1px solid ${rgba(light.color.base.border, 0.5)}`,
      },
    })
  }, [themeCtx])
}
