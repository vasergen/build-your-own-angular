'use strict'

function Scope() {
  this.$$watchers = []
}

function initWhatchVal() {}

Scope.prototype.$watch = function (whatchFn, listenerFn) {
  let watcher = {
    whatchFn,
    listenerFn: listenerFn || function() {},
    last: initWhatchVal
  }

  this.$$watchers.push(watcher)
}

Scope.prototype.$digest = function () {
  let self = this
  let newVal
  let oldVal

  this.$$watchers.forEach((watcher) => {
    newVal = watcher.whatchFn(self)
    oldVal = watcher.last
    if(newVal !== oldVal) {
      watcher.last = newVal
      watcher.listenerFn(
        newVal,
        (oldVal === initWhatchVal ? newVal : oldVal),
        self
      )
    }
  })
}
