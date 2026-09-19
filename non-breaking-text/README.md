# Non-Breaking Text

A small TypeScript utility for language-aware non-breaking typography.

It keeps selected short words with the word that follows them by replacing
the ordinary space with a non-breaking space (`U+00A0`). It also handles
spaced slash expressions such as `ARM / x86` and avoids modifying strings
that look like URLs, e-mail addresses or HTML.

The utility was extracted from the text-rendering logic used on
[kuzelka.dev](https://kuzelka.dev) and turned into a standalone,
framework-independent helper.

## Why

Short prepositions, articles and conjunctions can look awkward when they are
left at the end of a line. For example:

```text
v
Praze
```

can instead be kept together as:

```text
v Praze
```

The same applies to common English constructions such as `a car`,
`to a system` or `with an API`.

## Features

- Czech and English rules included by default.
- Custom language rule sets are supported.
- Uses Unicode-aware tokenization.
- Protects URLs, e-mail addresses and HTML-looking strings from changes.
- Keeps spaced slash expressions together (`ARM / x86`).
- Pure TypeScript; no React dependency.
- Unit tests cover positive, negative and edge cases.

## Example

```ts
import { applyNonBreakingText } from './src/index.js'

applyNonBreakingText('v Praze', { lang: 'cs' })
// => 'v\u00A0Praze'

applyNonBreakingText('to a system', { lang: 'en' })
// => 'to\u00A0a\u00A0system'

applyNonBreakingText('ARM / x86', { lang: 'en' })
// => 'ARM\u00A0/\u00A0x86'
```

## Custom language rules

```ts
applyNonBreakingText('et projet', {
  lang: 'fr',
  rules: {
    fr: ['et'],
  },
})
```

## Behavior

The utility tokenizes text into words, whitespace and punctuation. A regular
space after a configured short word is changed to NBSP only when another
word token follows.

This avoids naïve substring replacement and prevents accidental matches
inside unrelated words.

Strings that appear to contain machine-readable content are left unchanged:

```text
jan@kuzelka.dev
https://example.com/a/path
<span>a value</span>
```

For plain-text exports, `normalizePlainText()` converts NBSP characters back
to normal spaces.

## Development

```bash
npm install
npm test
npm run build
```

Or run both checks:

```bash
npm run check
```

## Origin

The original implementation lives inside the React/TypeScript source of
`kuzelka.dev`, where it is used to improve line breaking in bilingual site
content. This repository isolates the reusable text-processing logic from
site-specific rendering and metadata handling.

## Author

Jan Kuželka — [https://kuzelka.dev](https://kuzelka.dev)

## License

MIT. See [LICENSE](LICENSE).
