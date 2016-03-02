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

    it('trigger chained watchers in the same digest', () => {
      scope.name = 'Bob'

      let watchName = (scope) => {
        return scope.name
      }
      let changeNameUpper = (newVal, oldVal, scope) => {
        if(newVal) {
            scope.upperName = newVal.toUpperCase()
        }
      }
      let watchUpperName = (scope) => {
        return scope.upperName
      }
      let changeInitial = (newVal, oldVal, scope) => {
        if(newVal) {
          scope.initial = newVal.substring(0,1).concat('.')
        }
      }

      scope.$watch(watchUpperName, changeInitial)
      scope.$watch(watchName, changeNameUpper)

      scope.$digest()
      expect(scope.upperName).toBe('BOB')
      expect(scope.initial).toBe('B.')

      scope.name = 'John'
      scope.$digest()
      expect(scope.initial).toBe('J.')
    })

    it('check how many times digestOnce is called', () => {
      let watcher1 = () => {}
      spyOn(scope, '$digestOnce')

      scope.$watch(watcher1)
      scope.$digest()

      expect(scope.$digestOnce).toHaveBeenCalled()
    })

    it('gives up on watchers after 10 iteration', () => {
      scope.counterA = 0
      scope.counterB = 0

      let watcherA = (scope) => scope.counterA
      let watcherB = (scope) => scope.counterB
      let incA = (newVal, oldVal, scope) => scope.counterA++
      let incB = (newVal, oldVal, scope) => scope.counterB++

      scope.$watch(watcherA, incB)
      scope.$watch(watcherB, incA)

      expect(() => {scope.$digest()}).toThrow()
    })

    it('ends the digest when the last watch is clean', () => {
      scope.arr = _.range(100)
      let watchExecution = 0

      scope.arr.forEach((value, index) => {
        scope.$watch((scope) => {
          watchExecution++
          return scope.arr[index]
        }, () => {

        })
      })

      scope.$digest()
      expect(watchExecution).toBe(200)

      scope.arr[0] = -1
      scope.$digest()

      expect(watchExecution).toBe(301)
    })

    it('doesnt not end digest when new watcher added', () => {
      scope.propA = 'a'
      scope.counter = 0

      let watcherA = (scope) => scope.propA
      let incCounter = (newVal, oldVal, scope) => scope.counter++

      scope.$watch(watcherA, (newVal, oldVal, scope) => {
        scope.$watch(watcherA, incCounter)
      })

      scope.$digest()

      expect(scope.counter).toBe(1)
    })

    it('test $$areEqual', () => {
      expect(scope.$$areEqual(1,1)).toBe(true)
      expect(scope.$$areEqual(1, '1')).toBe(false)
      expect(scope.$$areEqual([1,2,3], [1,2,3], true)).toBe(true)
      expect(scope.$$areEqual([1,2,3], [1,2,3])).toBe(false)
    })

    it('compares based on value if enabled', () => {
      scope.propA = [1,2,3]
      scope.counter = 0

      let watcherA = (scope) => scope.propA
      let incCounter = (newVal, oldVal, scope) => scope.counter++

      scope.$watch(watcherA, incCounter, true)
      scope.$digest()
      expect(scope.counter).toBe(1)

      scope.propA.push(4)
      scope.$digest()
      expect(scope.counter).toBe(2)
    })

  })
})
