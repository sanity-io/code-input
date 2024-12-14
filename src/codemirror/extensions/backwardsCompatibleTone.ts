import type {ThemeContextValue} from '@sanity/ui'

/**
 * `@sanity/ui@v2.9` introduced two new tones; "neutral" and "suggest",
 * which maps to "default" and "primary" respectively in the old theme.
 * This function returns the "backwards compatible" tone value.
 *
 * @returns The tone value that is backwards compatible with the old theme.
 * @internal
 */
export function getBackwardsCompatibleTone(
  themeCtx: ThemeContextValue,
): Exclude<ThemeContextValue['tone'], 'neutral' | 'suggest'> {
  if (themeCtx.tone !== 'neutral' && themeCtx.tone !== 'suggest') {
    return themeCtx.tone
  }

  return themeCtx.tone === 'neutral' ? 'default' : 'primary'
}
