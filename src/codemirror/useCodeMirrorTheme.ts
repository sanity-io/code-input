import {useTheme} from '@sanity/ui'
import {useMemo} from 'react'
import {createTheme} from '@uiw/codemirror-themes'
import {hues} from '@sanity/color'
import {tags as t} from '@lezer/highlight'
import {Extension} from '@codemirror/state'

export function useCodeMirrorTheme(): Extension {
  const theme = useTheme()
  return useMemo(() => {
    const {dark, syntax, card} = theme.sanity.color
    return createTheme({
      theme: dark ? 'dark' : 'light',
      settings: {
        background: card.enabled.bg,
        foreground: card.enabled.fg,
        caret: card.enabled.fg,
        selection: hues.gray[dark ? 900 : 100].hex,
        selectionMatch: hues.blue[dark ? 900 : 100].hex,
        lineHighlight: '#8a91991a',
        gutterBackground: card.disabled.bg,
        gutterForeground: card.disabled.fg,
      },
      styles: [
        {
          tag: [t.heading, t.heading2, t.heading3, t.heading4, t.heading5, t.heading6],
          color: hues.blue[dark ? 400 : 700].hex,
        },
        {tag: t.quote, color: hues.green[dark ? 400 : 700].hex},
        {tag: t.comment, color: syntax.comment},
        {tag: t.variableName, color: syntax.variable},
        {tag: [t.string, t.special(t.brace)], color: syntax.string},
        {tag: t.number, color: syntax.number},
        {tag: t.bool, color: syntax.boolean},
        {tag: t.null, color: syntax.number},
        {tag: t.keyword, color: syntax.keyword},
        {tag: t.operator, color: syntax.operator},
        {tag: t.className, color: syntax.className},
        {tag: t.definition(t.typeName), color: syntax.function},
        {tag: t.typeName, color: syntax.entity},
        {tag: t.tagName, color: syntax.className},
        {tag: t.attributeName, color: syntax.attrName},
        {tag: t.propertyName, color: syntax.property},
        {tag: t.meta, color: hues.gray[dark ? 400 : 700].hex},
        {tag: t.angleBracket, color: hues.gray[dark ? 400 : 700].hex},
        {tag: t.bracket, color: hues.gray[dark ? 400 : 700].hex},
      ],
    })
  }, [theme])
}
