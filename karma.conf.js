'use strict'
// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'es6-shim'],
    files: [
      'src/*.js',
      'test/*.js'
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
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'], //PhantomJS, Chrome,
    singleRun: false,
  })
}
