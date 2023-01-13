import {definePlugin} from 'sanity'
import {codeSchema} from './schema'
import {CodeMode} from './codemirror/defaultCodeModes'
import {CodeInputConfigContext} from './codemirror/CodeModeContext'

export interface CodeInputConfig {
  codeModes?: CodeMode[]
}

/**
 * @public
 */
export const codeInput = definePlugin<CodeInputConfig | void>((config) => {
  const codeModes = config && config.codeModes
  const basePlugin = {
    name: '@sanity/code-input',
    schema: {types: [codeSchema]},
  }
  if (!codeModes) {
    return basePlugin
  }
  return {
    ...basePlugin,
    form: {
      components: {
        input: (props) => {
          if (props.id !== 'root') {
            return props.renderDefault(props)
          }
          return (
            <CodeInputConfigContext.Provider value={config}>
              {props.renderDefault(props)}
            </CodeInputConfigContext.Provider>
          )
        },
      },
    },
  }
})
