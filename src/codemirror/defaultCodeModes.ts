import {StreamLanguage} from '@codemirror/language'
import {type Extension} from '@codemirror/state'

export interface CodeMode {
  name: string
  loader: ModeLoader
}
export type ModeLoader = () => Promise<Extension | undefined> | Extension | undefined

export const defaultCodeModes: CodeMode[] = [
  {
    name: 'groq',
    loader: () =>
      import('@codemirror/lang-javascript').then(({javascript}) => javascript({jsx: false})),
  },
  {
    name: 'javascript',
    loader: () =>
      import('@codemirror/lang-javascript').then(({javascript}) => javascript({jsx: false})),
  },
  {
    name: 'jsx',
    loader: () =>
      import('@codemirror/lang-javascript').then(({javascript}) => javascript({jsx: true})),
  },
  {
    name: 'typescript',
    loader: () =>
      import('@codemirror/lang-javascript').then(({javascript}) =>
        javascript({jsx: false, typescript: true})
      ),
  },
  {
    name: 'tsx',
    loader: () =>
      import('@codemirror/lang-javascript').then(({javascript}) =>
        javascript({jsx: true, typescript: true})
      ),
  },
  {name: 'php', loader: () => import('@codemirror/lang-php').then(({php}) => php())},
  {name: 'sql', loader: () => import('@codemirror/lang-sql').then(({sql}) => sql())},
  {
    name: 'mysql',
    loader: () => import('@codemirror/lang-sql').then(({sql, MySQL}) => sql({dialect: MySQL})),
  },
  {name: 'json', loader: () => import('@codemirror/lang-json').then(({json}) => json())},
  {
    name: 'markdown',
    loader: () => import('@codemirror/lang-markdown').then(({markdown}) => markdown()),
  },
  {name: 'java', loader: () => import('@codemirror/lang-java').then(({java}) => java())},
  {name: 'html', loader: () => import('@codemirror/lang-html').then(({html}) => html())},
  {
    name: 'csharp',
    loader: () =>
      import('@codemirror/legacy-modes/mode/clike').then(({csharp}) =>
        StreamLanguage.define(csharp)
      ),
  },
  {
    name: 'sh',
    loader: () =>
      import('@codemirror/legacy-modes/mode/shell').then(({shell}) => StreamLanguage.define(shell)),
  },
  {
    name: 'css',
    loader: () =>
      import('@codemirror/legacy-modes/mode/css').then(({css}) => StreamLanguage.define(css)),
  },
  {
    name: 'scss',
    loader: () =>
      import('@codemirror/legacy-modes/mode/css').then(({css}) => StreamLanguage.define(css)),
  },
  {
    name: 'sass',
    loader: () =>
      import('@codemirror/legacy-modes/mode/sass').then(({sass}) => StreamLanguage.define(sass)),
  },
  {
    name: 'ruby',
    loader: () =>
      import('@codemirror/legacy-modes/mode/ruby').then(({ruby}) => StreamLanguage.define(ruby)),
  },
  {
    name: 'python',
    loader: () =>
      import('@codemirror/legacy-modes/mode/python').then(({python}) =>
        StreamLanguage.define(python)
      ),
  },
  {
    name: 'xml',
    loader: () =>
      import('@codemirror/legacy-modes/mode/xml').then(({xml}) => StreamLanguage.define(xml)),
  },
  {
    name: 'yaml',
    loader: () =>
      import('@codemirror/legacy-modes/mode/yaml').then(({yaml}) => StreamLanguage.define(yaml)),
  },
  {
    name: 'golang',
    loader: () =>
      import('@codemirror/legacy-modes/mode/go').then(({go}) => StreamLanguage.define(go)),
  },
  {name: 'text', loader: () => undefined},
  {name: 'batch', loader: () => undefined},
]
