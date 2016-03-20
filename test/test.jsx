/** @jsx createElement */

import _ from 'lodash'
import {expect} from 'chai'
import {createElement, compile} from 'elliptical'
import createProcess from '../src/index'

export function text (input) {
  return _.map(input.words, 'text').join('')
}

describe('elliptical-translate', () => {
  it('still works if no translations are provided', () => {
    const Test = {
      describe () {
        return <literal text='test' />
      }
    }

    const process = createProcess(['en-US'])
    const parse = compile(<Test />, process)
    const outputs = parse('')
    expect(outputs).to.have.length(1)
    expect(text(outputs[0])).to.equal('test')
  })

  it('picks exact locale if provided', () => {
    const Test = {
      translations: [{
        langs: ['es-ES'],
        describe () {
          return <literal text='test' />
        },
      }, {
        langs: ['default'],
        describe () {
          return <literal text='nope' />
        }
      }]
    }

    const process = createProcess(['es-ES'])
    const parse = compile(<Test />, process)
    const outputs = parse('')
    expect(outputs).to.have.length(1)
    expect(text(outputs[0])).to.equal('test')
  })

  it('picks a default locale if no match', () => {
    const Test = {
      translations: [{
        langs: ['es-ES'],
        describe () {
          return <literal text='nope' />
        },
      }, {
        langs: ['default'],
        describe () {
          return <literal text='test' />
        }
      }]
    }

    const process = createProcess(['en-US'])
    const parse = compile(<Test />, process)
    const outputs = parse('')
    expect(outputs).to.have.length(1)
    expect(text(outputs[0])).to.equal('test')
  })

  it('ignores case', () => {
    const Test = {
      translations: [{
        langs: ['es-ES'],
        describe () {
          return <literal text='test' />
        },
      }, {
        langs: ['default'],
        describe () {
          return <literal text='nope' />
        }
      }]
    }

    const process = createProcess(['Es-eS'])
    const parse = compile(<Test />, process)
    const outputs = parse('')
    expect(outputs).to.have.length(1)
    expect(text(outputs[0])).to.equal('test')
  })

  it('throws without default', () => {
    const Test = {
      translations: [{
        langs: ['es-ES'],
        describe () {
          return <literal text='test' />
        },
      }]
    }

    const process = createProcess(['en-US'])
    expect(() => compile(<Test />, process)).to.throw(Error)
  })
})