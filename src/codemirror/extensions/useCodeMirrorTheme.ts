import {rgba, useTheme} from '@sanity/ui'
import {useMemo} from 'react'
import {createTheme} from '@uiw/codemirror-themes'
import {tags as t} from '@lezer/highlight'
import {Extension} from '@codemirror/state'

export function useCodeMirrorTheme(): Extension {
  const theme = useTheme()

  return useMemo(() => {
    const {code: codeFont} = theme.sanity.fonts
    const {base, card, dark, syntax} = theme.sanity.color

    return createTheme({
      theme: dark ? 'dark' : 'light',
      settings: {
        background: card.enabled.bg,
        foreground: card.enabled.code.fg,
        lineHighlight: card.enabled.bg,
        fontFamily: codeFont.family,
        caret: base.focusRing,
        selection: rgba(base.focusRing, 0.2),
        selectionMatch: rgba(base.focusRing, 0.4),
        gutterBackground: card.disabled.bg,
        gutterForeground: card.disabled.code.fg,
        gutterActiveForeground: card.enabled.fg,
      },
      styles: [
        {
          tag: [t.heading, t.heading2, t.heading3, t.heading4, t.heading5, t.heading6],
          color: card.enabled.fg,
        },
        {tag: t.angleBracket, color: card.enabled.code.fg},
        {tag: t.atom, color: syntax.keyword},
        {tag: t.attributeName, color: syntax.attrName},
        {tag: t.bool, color: syntax.boolean},
        {tag: t.bracket, color: card.enabled.code.fg},
        {tag: t.className, color: syntax.className},
        {tag: t.comment, color: syntax.comment},
        {tag: t.definition(t.typeName), color: syntax.function},
        {
          tag: [
            t.definition(t.variableName),
            t.function(t.variableName),
            t.className,
            t.attributeName,
          ],
          color: syntax.function,
        },
        {tag: [t.function(t.propertyName), t.propertyName], color: syntax.function},
        {tag: t.keyword, color: syntax.keyword},
        {tag: t.null, color: syntax.number},
        {tag: t.number, color: syntax.number},
        {tag: t.meta, color: card.enabled.code.fg},
        {tag: t.operator, color: syntax.operator},
        {tag: t.propertyName, color: syntax.property},
        {tag: [t.string, t.special(t.brace)], color: syntax.string},
        {tag: t.tagName, color: syntax.className},
        {tag: t.typeName, color: syntax.keyword},
      ],
    })
  }, [theme])
}
