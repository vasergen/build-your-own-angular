'use strict';

let gulp = require('gulp')
let jshint = require('gulp-jshint')
let jasminePhantom = require('gulp-jasmine-phantom')
let jasmine = require('gulp-jasmine')
let Server = require('karma').Server

gulp.task('jshint', () => {
  gulp.src(['./src/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter())
})

gulp.task('jasmine', () => {
  gulp.src('./test/**/*.js')
    .pipe(jasmine())
})

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done()
  }).start()
})
