import { describe, beforeEach, it, expect, vi } from 'vitest'
import { DOM } from './html'
import logger from '../../common/logger/logger'
import { ElementKeySymbol } from '../../symbols'
import { keyBuilder } from '../../common/key-builder/key-builder'

describe('html.ts', () => {
  let element: HTMLElement
  let parent: HTMLElement
  let child: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    // Mock logger to avoid actual logs in tests
    vi.spyOn(logger, 'error').mockImplementation(() => { void 0 })
    vi.spyOn(logger, 'log').mockImplementation(() => { void 0 })

    parent = document.createElement('div')
    child = document.createElement('span')
  })

  describe('createElement', () => {
    it('creates an element with a specified tag name', () => {
      const key = keyBuilder()
      const element = DOM.createElement('section', key)
      expect(element.tagName.toLowerCase()).toBe('section')
      expect(element[ElementKeySymbol]).toBe(key.toString())
    })

    it('assigns the provided key to the element', () => {
      const key = keyBuilder()
      const element = DOM.createElement('div', key)
      expect(element[ElementKeySymbol]).toBe(key.toString())
    })
  })

  describe('createComment', () => {
    it('creates a comment node', () => {
      const comment = DOM.createComment('test comment')
      expect(comment.nodeType).toBe(Node.COMMENT_NODE)
      expect(comment.nodeValue).toBe('test comment')
    })
  })

  describe('appendChild', () => {
    it('appends a single child to the parent', () => {
      DOM.appendChild(parent, child)
      expect(parent.contains(child)).toBe(true)
    })

    it('appends multiple children when passed an array', () => {
      const child1 = document.createElement('div')
      const child2 = document.createElement('div')
      DOM.appendChild(parent, [child1, child2])
      expect(parent.contains(child1)).toBe(true)
      expect(parent.contains(child2)).toBe(true)
    })

    it('does nothing if child is null or undefined', () => {
      DOM.appendChild(parent, null as unknown as Node)
      DOM.appendChild(parent, undefined as unknown as Node)
      expect(parent.childNodes.length).toBe(0)
    })

    it('logs an error if parent is null or undefined', () => {
      // @ts-expect-error intentionally passing invalid parent
      DOM.appendChild(null, child)
      expect(logger.error).toHaveBeenCalled()
    })

    it('does not re-append if child is already in the parent', () => {
      DOM.appendChild(parent, child)
      DOM.appendChild(parent, child)
      expect(parent.childNodes.length).toBe(1)
    })

    it('logs an error if parent is the same as child', () => {
      DOM.appendChild(child, child)
      expect(logger.error).toHaveBeenCalled()
    })

    it('logs an error if parent is a text node', () => {
      const textNode = document.createTextNode('hi')
      // @ts-expect-error intentionally passing invalid parent
      DOM.appendChild(textNode, child)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('classListRemove', () => {
    it('removes a single class when it exists', () => {
      element.classList.add('foo')
      DOM.classListRemove(element, 'foo')
      expect(element.classList.contains('foo')).toBe(false)
    })

    it('removes multiple classes separated by whitespace', () => {
      element.classList.add('foo', 'bar', 'baz')
      DOM.classListRemove(element, 'bar   baz')
      expect(element.classList.contains('bar')).toBe(false)
      expect(element.classList.contains('baz')).toBe(false)
      expect(element.classList.contains('foo')).toBe(true)
    })

    it('does nothing if the string is empty or whitespace', () => {
      element.classList.add('foo')
      DOM.classListRemove(element, '')
      expect(element.classList.contains('foo')).toBe(true)

      DOM.classListRemove(element, '   ')
      expect(element.classList.contains('foo')).toBe(true)
    })

    it('removes multiple classes when passed an array', () => {
      element.classList.add('foo', 'bar', 'baz')
      DOM.classListRemove(element, ['bar', 'baz'])
      expect(element.classList.contains('bar')).toBe(false)
      expect(element.classList.contains('baz')).toBe(false)
      expect(element.classList.contains('foo')).toBe(true)
    })
  })

  describe('classListAdd', () => {
    it('adds a single class', () => {
      DOM.classListAdd(element, 'foo')
      expect(element.classList.contains('foo')).toBe(true)
    })

    it('adds multiple classes separated by whitespace', () => {
      DOM.classListAdd(element, 'foo   bar baz')
      expect(element.classList.contains('foo')).toBe(true)
      expect(element.classList.contains('bar')).toBe(true)
      expect(element.classList.contains('baz')).toBe(true)
    })

    it('does nothing if the string is empty or whitespace', () => {
      DOM.classListAdd(element, '')
      expect(element.classList.length).toBe(0)

      DOM.classListAdd(element, '   ')
      expect(element.classList.length).toBe(0)
    })

    it('adds multiple classes when passed an array', () => {
      DOM.classListAdd(element, ['foo', 'bar'])
      expect(element.classList.contains('foo')).toBe(true)
      expect(element.classList.contains('bar')).toBe(true)
    })
  })

  describe('removeAllChildren', () => {
    it('removes all children from an element', () => {
      const child1 = document.createElement('p')
      const child2 = document.createElement('span')
      parent.appendChild(child1)
      parent.appendChild(child2)
      expect(parent.childNodes.length).toBe(2)

      DOM.removeAllChildren(parent)
      expect(parent.childNodes.length).toBe(0)
    })

    it('does nothing if there are no children', () => {
      expect(parent.childNodes.length).toBe(0)
      DOM.removeAllChildren(parent)
      expect(parent.childNodes.length).toBe(0)
    })
  })
})