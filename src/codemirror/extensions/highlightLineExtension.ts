/* eslint-disable no-param-reassign */

import {Extension, StateEffect, StateField} from '@codemirror/state'
import {Decoration, EditorView, lineNumbers} from '@codemirror/view'
import {ThemeContextValue, rgba} from '@sanity/ui'

const highlightLineClass = 'cm-highlight-line'

export const addLineHighlight = StateEffect.define<number>()
export const removeLineHighlight = StateEffect.define<number>()

export const lineHighlightField = StateField.define({
  create() {
    return Decoration.none
  },
  update(lines, tr) {
    lines = lines.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(addLineHighlight)) {
        lines = lines.update({add: [lineHighlightMark.range(e.value)]})
      }
      if (e.is(removeLineHighlight)) {
        lines = lines.update({
          filter: (from) => {
            // removeLineHighlight value is lineStart for the highlight, so keep other effects
            return from !== e.value
          },
        })
      }
    }
    return lines
  },
  toJSON(value, state) {
    const highlightLines: number[] = []
    const iter = value.iter()
    while (iter.value) {
      const lineNumber = state.doc.lineAt(iter.from).number
      if (!highlightLines.includes(lineNumber)) {
        highlightLines.push(lineNumber)
      }
      iter.next()
    }
    return highlightLines
  },
  fromJSON(value: number[], state) {
    const lines = state.doc.lines
    const highlights = value
      .filter((line) => line <= lines) // one-indexed
      .map((line) => lineHighlightMark.range(state.doc.line(line).from))
    highlights.sort((a, b) => a.from - b.from)
    try {
      return Decoration.none.update({
        add: highlights,
      })
    } catch (e) {
      console.error(e)
      return Decoration.none
    }
  },
  provide: (f) => EditorView.decorations.from(f),
})

const lineHighlightMark = Decoration.line({
  class: highlightLineClass,
})

export const highlightState: {
  [prop: string]: StateField<any>
} = {
  highlight: lineHighlightField,
}

export interface HighlightLineConfig {
  onHighlightChange?: (lines: number[]) => void
  readOnly?: boolean
  theme: ThemeContextValue
}

function createCodeMirrorTheme(options: {themeCtx: ThemeContextValue}) {
  const {themeCtx} = options
  const dark = {color: themeCtx.theme.color.dark[themeCtx.tone]}
  const light = {color: themeCtx.theme.color.light[themeCtx.tone]}

  return EditorView.baseTheme({
    '.cm-lineNumbers': {
      cursor: 'default',
    },
    '.cm-line.cm-line': {
      position: 'relative',
    },

    // need set background with pseudoelement so it does not render over selection color
    [`.${highlightLineClass}::before`]: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: -3,
      content: "''",
      boxSizing: 'border-box',
    },
    [`&dark .${highlightLineClass}::before`]: {
      background: rgba(dark.color.muted.caution.pressed.bg, 0.5),
    },
    [`&light .${highlightLineClass}::before`]: {
      background: rgba(light.color.muted.caution.pressed.bg, 0.75),
    },
  })
}

export const highlightLine = (config: HighlightLineConfig): Extension => {
  const highlightTheme = createCodeMirrorTheme({themeCtx: config.theme})

  return [
    lineHighlightField,
    config.readOnly
      ? []
      : lineNumbers({
          domEventHandlers: {
            mousedown: (editorView, lineInfo) => {
              // Determine if the line for the clicked gutter line number has highlighted state or not
              const line = editorView.state.doc.lineAt(lineInfo.from)
              let isHighlighted = false
              editorView.state
                .field(lineHighlightField)
                .between(line.from, line.to, (from, to, value) => {
                  if (value) {
                    isHighlighted = true
                    return false // stop iteration
                  }
                  return undefined
                })

              if (isHighlighted) {
                editorView.dispatch({effects: removeLineHighlight.of(line.from)})
              } else {
                editorView.dispatch({effects: addLineHighlight.of(line.from)})
              }
              if (config?.onHighlightChange) {
                config.onHighlightChange(editorView.state.toJSON(highlightState).highlight)
              }
              return true
            },
          },
        }),
    highlightTheme,
  ]
}

/**
 * Adds and removes highlights to the provided view using highlightLines
 * @param view
 * @param highlightLines
 */
export function setHighlightedLines(view: EditorView, highlightLines: number[]): void {
  const doc = view.state.doc
  const lines = doc.lines
  //1-based line numbers
  const allLineNumbers = Array.from({length: lines}, (x, i) => i + 1)
  view.dispatch({
    effects: allLineNumbers.map((lineNumber) => {
      const line = doc.line(lineNumber)
      if (highlightLines?.includes(lineNumber)) {
        return addLineHighlight.of(line.from)
      }
      return removeLineHighlight.of(line.from)
    }),
  })
}
