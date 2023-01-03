import {LANGUAGE_ALIASES, SUPPORTED_LANGUAGES} from '../config'
import {CodeInputLanguage, CodeInputValue, CodeSchemaType} from '../types'
import {useMemo} from 'react'

export const defaultLanguageMode = 'text'

export function useLanguageMode(schemaType: CodeSchemaType, value?: CodeInputValue) {
  const languages = useLanguageAlternatives(schemaType)
  const fixedLanguage = schemaType.options?.language
  const language = value?.language ?? fixedLanguage ?? defaultLanguageMode

  // the language config from the schema
  const configured = languages.find((entry) => entry.value === language)
  const languageMode = configured?.mode ?? resolveAliasedLanguage(language) ?? defaultLanguageMode

  return {language, languageMode, languages}
}

function resolveAliasedLanguage(lang?: string) {
  return (lang && LANGUAGE_ALIASES[lang]) ?? lang
}

function useLanguageAlternatives(type: CodeSchemaType) {
  return useMemo((): CodeInputLanguage[] => {
    const languageAlternatives = type.options?.languageAlternatives
    if (!languageAlternatives) {
      return SUPPORTED_LANGUAGES
    }

    if (!Array.isArray(languageAlternatives)) {
      throw new Error(
        `'options.languageAlternatives' should be an array, got ${typeof languageAlternatives}`
      )
    }

    return languageAlternatives.reduce((acc: CodeInputLanguage[], {title, value: val, mode}) => {
      const alias = LANGUAGE_ALIASES[val]
      if (alias) {
        // eslint-disable-next-line no-console
        console.warn(
          `'options.languageAlternatives' lists a language with value "%s", which is an alias of "%s" - please replace the value to read "%s"`,
          val,
          alias,
          alias
        )

        return acc.concat({title, value: alias, mode: mode})
      }
      return acc.concat({title, value: val, mode})
    }, [])
  }, [type])
}
