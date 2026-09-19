// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Jan Kuželka

const NBSP = '\u00A0'

export type NonBreakingLanguageRules = Readonly<Record<string, readonly string[]>>

export const defaultShortWords: NonBreakingLanguageRules = {
  en: ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'of', 'for', 'by', 'with', 'and', 'or'],
  cs: ['a', 'i', 'o', 'u', 'v', 've', 'z', 'ze', 'k', 'ke', 's', 'se', 'do', 'na', 'po', 'za', 'od', 'pro', 'bez', 'pod', 'nad'],
}

export interface NonBreakingTextOptions {
  /**
   * Language key used to select the short-word list.
   */
  lang: string

  /**
   * Custom language rules. Defaults to `defaultShortWords`.
   */
  rules?: NonBreakingLanguageRules

  /**
   * Keep `word / word` together as `word / word`.
   * Enabled by default.
   */
  slashSpacing?: boolean
}

function looksLikeProtectedText(text: string): boolean {
  return /https?:\/\/|www\.|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|<\/?[a-z][^>]*>/iu.test(text)
}

function applyNonBreakingSlashSpacing(text: string): string {
  return text.replace(/(\S) \/ (?=\S)/gu, `$1${NBSP}/${NBSP}`)
}

function isWordToken(value: string): boolean {
  return /^[\p{L}\p{N}]+$/u.test(value)
}

function isHorizontalWhitespaceToken(value: string): boolean {
  return /^[^\S\r\n]+$/u.test(value)
}

/**
 * Replaces ordinary spaces after selected short words with NBSP characters.
 *
 * The function deliberately leaves URLs, e-mail addresses and HTML-looking
 * strings unchanged to avoid corrupting machine-readable content.
 */
export function applyNonBreakingText(
  text: string,
  options: NonBreakingTextOptions,
): string {
  const {
    lang,
    rules = defaultShortWords,
    slashSpacing = true,
  } = options

  const words = rules[lang]

  if (!text || !words || looksLikeProtectedText(text)) {
    return text
  }

  const normalizedText = slashSpacing
    ? applyNonBreakingSlashSpacing(text)
    : text

  const tokens = normalizedText.match(/\s+|[\p{L}\p{N}]+|[^\p{L}\p{N}\s]+/gu)

  if (!tokens) {
    return normalizedText
  }

  const shortWordSet = new Set(
    words.map((word) => word.toLocaleLowerCase(lang)),
  )

  for (let index = 0; index < tokens.length - 2; index += 1) {
    const token = tokens[index]
    const whitespaceToken = tokens[index + 1]
    const nextToken = tokens[index + 2]

    if (!isWordToken(token) || !isHorizontalWhitespaceToken(whitespaceToken)) {
      continue
    }

    if (!isWordToken(nextToken)) {
      continue
    }

    if (!shortWordSet.has(token.toLocaleLowerCase(lang))) {
      continue
    }

    tokens[index + 1] = whitespaceToken.replace(/ /g, NBSP)
  }

  return tokens.join('')
}

/**
 * Converts NBSP characters back to ordinary spaces for plain-text exports.
 */
export function normalizePlainText(text: string): string {
  return text.replace(/\u00A0/gu, ' ')
}

export { NBSP }
