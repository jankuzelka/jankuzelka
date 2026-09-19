// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Jan Kuželka

import { describe, expect, it } from 'vitest'
import {
  NBSP,
  applyNonBreakingText,
  normalizePlainText,
} from '../src/core.js'

describe('applyNonBreakingText', () => {
  it.each([
    ['a car', `a${NBSP}car`],
    ['systems and backend', `systems and${NBSP}backend`],
    ['performance of systems', `performance of${NBSP}systems`],
    ['to a system', `to${NBSP}a${NBSP}system`],
    ['with an API', `with${NBSP}an${NBSP}API`],
  ])('handles English short words: %s', (input, expected) => {
    expect(applyNonBreakingText(input, { lang: 'en' })).toBe(expected)
  })

  it.each([
    ['v Praze', `v${NBSP}Praze`],
    ['a backend', `a${NBSP}backend`],
    ['se systémem', `se${NBSP}systémem`],
    ['se na implementaci', `se${NBSP}na${NBSP}implementaci`],
    ['v a kolem Prahy', `v${NBSP}a${NBSP}kolem Prahy`],
    ['na implementaci PGP', `na${NBSP}implementaci PGP`],
    ['s AI a testy', `s${NBSP}AI a${NBSP}testy`],
  ])('handles Czech short words: %s', (input, expected) => {
    expect(applyNonBreakingText(input, { lang: 'cs' })).toBe(expected)
  })

  it.each([
    ['data', 'data'],
    ['platform', 'platform'],
    ['jan@kuzelka.dev', 'jan@kuzelka.dev'],
    ['https://example.com/a/path', 'https://example.com/a/path'],
    ['C++/CLI', 'C++/CLI'],
    ['<span>a value</span>', '<span>a value</span>'],
  ])('keeps protected or unrelated text unchanged: %s', (input, expected) => {
    expect(applyNonBreakingText(input, { lang: 'en' })).toBe(expected)
  })

  it.each([
    ['ARM / x86', `ARM${NBSP}/${NBSP}x86`],
    ['PHP / Nette', `PHP${NBSP}/${NBSP}Nette`],
  ])('keeps spaced slash expressions together: %s', (input, expected) => {
    expect(applyNonBreakingText(input, { lang: 'en' })).toBe(expected)
  })

  it('allows custom language rules', () => {
    expect(
      applyNonBreakingText('et projet', {
        lang: 'fr',
        rules: { fr: ['et'] },
      }),
    ).toBe(`et${NBSP}projet`)
  })

  it('can disable slash spacing', () => {
    expect(
      applyNonBreakingText('ARM / x86', {
        lang: 'en',
        slashSpacing: false,
      }),
    ).toBe('ARM / x86')
  })
})

describe('normalizePlainText', () => {
  it('converts NBSP back to spaces', () => {
    expect(normalizePlainText(`a${NBSP}car`)).toBe('a car')
  })
})
