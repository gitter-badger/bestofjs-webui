var jsdom = require('jsdom');

// Function to be run once before all tests.

function init() {
  process.env.NODE_ENV = 'test';
  if (global.window) {
    console.log('((( window object already initialized )))');
    return;
  }

  // setup the simplest document possible
  var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  var win = doc.defaultView;
  global.document = doc;
  global.window = win;

  // seems to be required to deal with `dangerouslySetInnerHTML`
  // (README section in the Project page)
  global.navigator = {
    userAgent: 'node.js'
  };
  return;
}
module.exports = init;
