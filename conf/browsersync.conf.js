const conf = require('./gulp.conf');
const url = require('url');
const proxy = require('proxy-middleware');

module.exports = function () {
  //const proxyOptions = url.parse('https://com-cin-jira.appspot.com');
  const proxyOptions = url.parse('http://localhost:5431');
  proxyOptions.route = '/api';

  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: [proxy(proxyOptions)]
    },
    open: false
  };
};
