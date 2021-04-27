console.log('loading baz...');
script.ready('main', function() {
  console.log('foo loaded: hello from ' + baz);
  window.thunky = 'ness';
});