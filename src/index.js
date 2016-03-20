import _ from 'lodash'

function getCall (translations, locales) {
  const potential = _.chain(locales)
    .concat('default')
    .map(locale => _.find(translations, (obj) => {
      const langs = _.map(obj.langs, (lang) => lang.toLowerCase())
      return _.includes(langs, locale.toLowerCase())
    }))
    .filter()
    .first()
    .value()

  if (potential) {
    return potential.describe
  } else {
    throw new Error(`Missing a default translation: ${JSON.stringify(translations)}`)
  }
}

export default function createProcess (locales) {
  return function process (element) {
    if (element.type.translations) {
      const describe = getCall(element.type.translations, locales)
      const newType = _.assign({}, element.type, {describe})
      delete newType.translations
      return _.assign({}, element, {type: newType})
    } else {
      return element
    }
  }
}