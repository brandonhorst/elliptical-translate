import _ from 'lodash'
import {Locales} from 'locale'

function normalizeLocale (locale) {
  return locale.toLowerCase().replace('_', '-')
}

function getCall (translations, desired) {
  const availableStrings = _.chain(translations)
    .map(obj => obj.langs || [obj.lang])
    .concat()
    .value()

  const available = new Locales(availableStrings)

  const best = desired.best(available)

  // if we got one
  if (!best.defaulted) {
    return _.find(translations, (obj) => {
      const langs = obj.lang ? [obj.lang] : obj.langs
      const normLangs = _.map(langs, lang => normalizeLocale(lang))
      return _.includes(normLangs, normalizeLocale(best.normalized))
    }).describe
  }
}

export default function createProcess (desiredStrings) {
  const desired = new Locales(desiredStrings, 'default')
  return function process (element) {
    if (element.type.translations) {
      const describe = getCall(element.type.translations, desired)
      if (describe) {
        const newType = _.assign({}, element.type, {describe})
        delete newType.translations
        return _.assign({}, element, {type: newType})
      }
    }
    return element
  }
}