import _ from 'lodash'

function getCall (translations, locales) {
  const potential = _.chain(locales)
    .map(locale => _.find(translations, (obj) => {
      const langs = obj.lang ? [obj.lang] : obj.langs
      const lowerLangs = _.map(langs, lang => lang.toLowerCase())
      return _.includes(lowerLangs, locale.toLowerCase())
    }))
    .filter()
    .first()
    .value()

  if (potential) {
    return potential.describe
  } else {

  }
}

export default function createProcess (locales) {
  return function process (element) {
    if (element.type.translations) {
      const describe = getCall(element.type.translations, locales)
      if (describe) {
        const newType = _.assign({}, element.type, {describe})
        delete newType.translations
        return _.assign({}, element, {type: newType})
      }
    }
    return element
  }
}