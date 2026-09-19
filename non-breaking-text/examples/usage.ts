// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Jan Kuželka

import { applyNonBreakingText } from '../src/index.js'

console.log(
  applyNonBreakingText('Building systems and tools in Prague', {
    lang: 'en',
  }),
)

console.log(
  applyNonBreakingText('Vývoj v Praze a okolí', {
    lang: 'cs',
  }),
)
