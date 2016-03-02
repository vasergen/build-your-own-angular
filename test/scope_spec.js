'use strict'

describe('Scope', () => {
  it('can be constructered and used as an object', () => {
    let scope = new Scope()
    scope.propA = 1

    expect(scope.propA).toBe(1)
  })

  describe('Digest', () => {
    let scope

    beforeEach(() => {
      scope = new Scope()
    })

    it('calls the listener function on first digest', () => {
      let watchFn = () => 'wat'
      let listenerFn = jasmine.createSpy('listenerFn')
      scope.$watch(watchFn, listenerFn)
      scope.$digest()

      expect(listenerFn).toHaveBeenCalled()
    })

    it('call the watch function with scope argument', () => {
      let watchFn = jasmine.createSpy('watchFn')
      let listenerFn = () => {}
      scope.$watch(watchFn, listenerFn)
      scope.$digest()

      expect(watchFn).toHaveBeenCalledWith(scope)
    })

    it('call the watch function when value changes', () => {
      scope.propA = 'a'
      scope.counter = 0

      let whatchFn = (scope) => {
        return scope.propA
      }
      let listenerFn = (newVal, oldVal, scope) => {
        scope.counter++
      }
      scope.$watch(whatchFn, listenerFn)

      expect(scope.counter).toBe(0)
      scope.$digest()
      expect(scope.counter).toBe(1)
      scope.$digest()
      expect(scope.counter).toBe(1)
      scope.propA = 'b'
      scope.$digest()
      expect(scope.counter).toBe(2)
    })

    it('call the whatch function which return undefined', () => {
      scope.counter = 0
      let watchFn = (scope) => {
        return scope.propA
      }
      let listenerFn = (newVal, oldVal, scope) => {
        scope.counter++
      }

      scope.$watch(watchFn, listenerFn)
      expect(scope.counter).toBe(0)
      scope.$digest()
      expect(scope.counter).toBe(1)
    })

    it('call listener with new value as old value', () => {
      scope.propA = 123
      let oldValGiven

      let watchFn = (scope) => {
        return scope.propA
      }

      let listenerFn = (newVal, oldVal, scope) => {
        oldValGiven = oldVal
      }

      scope.$watch(watchFn, listenerFn)
      scope.$digest()

      expect(oldValGiven).toBe(123)
    })

    it('may have watcher that omit the listener function', () => {
      let watcherFn = jasmine.createSpy('watcherFn')
      scope.$watch(watcherFn)
      scope.$digest()

      expect(watcherFn).toHaveBeenCalled()
    })

  })
})
