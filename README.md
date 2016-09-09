# elliptical-translate

Multiple language support for elliptical

Phrases may specify a `translations` array in addition to a `describe` function.
An ordered array of language tags should be supplied to `createProcessor`.
At compilation, the most specific language from the translations will be
selected. Otherwise, the default `describe` will be used.

```js
const MyPhrase = {
  translations: [{
    langs: ['en'],
    describe: () => <literal text='truck' />
  }, {
    langs: ['en-GB', 'en-ZA', 'en-IE', 'en-IN'],
    describe: () => <literal text='lorry' />
  }, {
    lang: 'es',
    describe: () => <literal text='camión' />
  }],
  describe: () => <literal text='truck' />
}
```

## Installation

```sh
npm install elliptical-translate
```

## Guidelines

Any strings will work, but in practice, you should use
[IETF RFC 5646](https://tools.ietf.org/html/rfc5646) language tags.
Tags passed to `createProcess` should be from most specific to most general,
such as `['zh-Hans-CH', 'zh-Hans', 'zh-CN', 'zh']`, meaning:
prefer Simplified Chinese as used in mainland China, then Simplified Chinese,
then Chinese as used in mainland China, then Chinese. This allows
elliptical-translate to always pick the best available translation.

## Usage

```js
/** @jsx createElement */
import createProcess from 'elliptical-translate'
import {compile, createElement} from 'elliptical'

let parse, process

// pick the most specific lang available
process = createProcess(['en-GB', 'en'])
parse = compile(<MyPhrase />, process)
parse('') // => lorry

// fall back to less specific langs if possible
process = createProcess(['en-US', 'en'])
parse = compile(<MyPhrase />, process)
parse('') // => truck

process = createProcess(['es-ES', 'es'])
parse = compile(<MyPhrase />, process)
parse('') // => camión

// if no langs exist, select the default
process = createProcess(['zh-Hans-CH', 'zh-Hans', 'zh-CN', 'zh'])
parse = compile(<MyPhrase />, process)
parse('') // => truck
```
