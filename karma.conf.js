'use strict'
// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    files: [
      'src/*.js',
      'test/*.js',
      'vendor/lodash.js',
      'vendor/jquery.js'
    ],
    exclude: [],
    preprocessors: {
      'test/*.html' : ['html2js'],
      'src/*.js' : ['babel'],
      'test/*.js' : ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },
    specReporter: {
        maxLogLines: 5,
        suppressErrorSummary: false,
        suppressFailed: false,
        suppressPassed: false,
        suppressSkipped: true,
        showSpecTiming: true
      },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'], //PhantomJS, Chrome,
    singleRun: false,
  })
}
