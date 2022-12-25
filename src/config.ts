import {CodeInputLanguage} from './types'

// NOTE: MAKE SURE THESE ALIGN WITH CODE MODES IN ./codemirror/defaultCodeModes.ts
export const SUPPORTED_LANGUAGES: CodeInputLanguage[] = [
  {title: 'Batch file', value: 'batchfile'},
  {title: 'C#', value: 'csharp'},
  {title: 'CSS', value: 'css'},
  {title: 'Go', value: 'golang'},
  {title: 'GROQ', value: 'groq'},
  {title: 'HTML', value: 'html'},
  {title: 'Java', value: 'java'},
  {title: 'JavaScript', value: 'javascript'},
  {title: 'JSON', value: 'json'},
  {title: 'JSX', value: 'jsx'},
  {title: 'Markdown', value: 'markdown'},
  {title: 'MySQL', value: 'mysql'},
  {title: 'PHP', value: 'php'},
  {title: 'Plain text', value: 'text'},
  {title: 'Python', value: 'python'},
  {title: 'Ruby', value: 'ruby'},
  {title: 'SASS', value: 'sass'},
  {title: 'SCSS', value: 'scss'},
  {title: 'sh', value: 'sh'},
  {title: 'TSX', value: 'tsx'},
  {title: 'TypeScript', value: 'typescript'},
  {title: 'XML', value: 'xml'},
  {title: 'YAML', value: 'yaml'},
]

export const LANGUAGE_ALIASES: Record<string, string | undefined> = {js: 'javascript'}

export const PATH_LANGUAGE = ['language']
export const PATH_CODE = ['code']
export const PATH_FILENAME = ['filename']
