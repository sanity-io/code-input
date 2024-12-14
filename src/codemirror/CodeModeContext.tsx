import {createContext} from 'react'

import type {CodeInputConfig} from '../plugin'

export const CodeInputConfigContext = createContext<CodeInputConfig | undefined>(undefined)
