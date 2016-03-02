'use strict'

function Scope() {
  this.$$watchers = []
  this.$$lastDirtyWatch = null
}

function initWhatchVal() {}

Scope.prototype.$$areEqual = function(newVal, oldVal, valueEq) {
  if(valueEq)
    return _.isEqual(newVal, oldVal)

  return newVal === oldVal
}

Scope.prototype.$watch = function (whatchFn, listenerFn, valueEq) {
  let watcher = {
    whatchFn,
    valueEq: !!valueEq,
    listenerFn: listenerFn || function() {},
    last: initWhatchVal
  }

  this.$$watchers.push(watcher)
  this.$$lastDirtyWatch = null
}

Scope.prototype.$digestOnce = function () {
  let self = this
  let newVal
  let oldVal
  let dirty

  _.forEach(this.$$watchers, (watcher) => {
    newVal = watcher.whatchFn(self)
    oldVal = watcher.last

    if(!self.$$areEqual(newVal,oldVal, watcher.valueEq)) {
      this.$$lastDirtyWatch = watcher
      dirty = true
      watcher.last = watcher.valueEq ? _.cloneDeep(newVal) : newVal
      watcher.listenerFn(
        newVal,
        (oldVal === initWhatchVal ? newVal : oldVal),
        self
      )
    } else if (this.$$lastDirtyWatch == watcher) {
      return false
    }
  })
  return dirty
}

Scope.prototype.$digest = function() {
  let dirty
  let ttl = 10
  this.$$lastDirtyWatch = null

  do {
    dirty = this.$digestOnce()
    if(dirty && (!--ttl) ) throw "Maximum digest iteration reached"
  } while (dirty)
}
