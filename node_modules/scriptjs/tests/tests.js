script('../node_modules/domready/ready.js', function () {

  domready(function() {

    sink('Basic', function(test, ok, before, after) {

      test('should call from chained ready calls', 4, function() {

        script.ready('jquery', function() {
          ok(true, 'loaded from ready callback')
        })

        script.ready('jquery', function() {
          ok(true, 'called jquery callback again')
        })
          .ready('jquery', function() {
            ok(true, 'called ready on a chain')
          })

        script('../vendor/jquery.js', 'jquery', function() {
          ok(true, 'loaded from base callback')
        })

      })

      test('multiple files can be loaded at once', 1, function() {
        script(['../demos/js/foo.js', '../demos/js/bar.js'], function() {
          ok(true, 'foo and bar have been loaded')
        })
      })

      test('ready should wait for multiple files by name', 1, function() {
        script(['../demos/js/baz.js', '../demos/js/thunk.js'], 'bundle').ready('bundle', function() {
          ok(true, 'batch has been loaded')
        })
      })

      test('ready should wait for several batches by name', 1, function() {
        script('../vendor/yui-utilities.js', 'yui')
        script('../vendor/mootools.js', 'moomoo')
        script.ready(['yui', 'moomoo'], function() {
          console.log('ONCE')
          ok(true, 'multiple batch has been loaded')
        })
      })

      test('ready should not call a duplicate callback', 1, function() {
        script.ready(['yui', 'moomoo'], function() {
          console.log('TWICE')
          ok(true, 'found yui and moomoo again')
        })
      })

      test('ready should not call a callback a third time', 1, function() {
        script.ready(['yui', 'moomoo'], function() {
          console.log('THREE')
          ok(true, 'found yui and moomoo again')
        })
      })

      test('should load a single file without extra arguments', 1, function () {
        var err = false
        try {
          script('../vendor/yui-utilities.js')
        } catch (ex) {
          err = true
          console.log('wtf ex', ex)
        } finally {
          ok(!err, 'no error')
        }
      })

      test('should callback a duplicate file without loading the file', 1, function () {
        script('../vendor/yui-utilities.js', function () {
          ok(true, 'loaded yui twice. nice')
        })
      })

      test('onerror', 1, function () {
        script('waaaaaaaaaaaa', function () {
          ok(true, 'no waaaa')
        })
      })

      test('setting script path', 3, function () {
        script.path('../vendor/')
        script(['patha', 'pathb', 'http://ded.github.com/morpheus/morpheus.js'], function () {
          ok(patha == true, 'loaded patha.js')
          ok(pathb == true, 'loaded pathb.js')
          ok(typeof morpheus !== 'undefined', 'loaded morpheus.js from http')
        })
      })
      
      test('passing urlArgs', 2, function () {
        script.urlArgs('key=value')
        script(['../demos/js/foo.js'], function() {
          ok(true, 'foo has been loaded with given urlArgs')
        })
        script(['../demos/js/bar.js?foo=bar'], function() {
          ok(true, 'bar has been loaded and urlArgs have been added to existing query string')
        })
      })

      test('syncronous ordered loading', 2, function () {
        script.order(['order-a', 'order-b', 'order-c'], 'ordered-id', function () {
          ok(true, 'loaded each file in order')
          console.log('loaded each file in order')
        })
        script.ready('ordered-id', function () {
          console.log('readiness by id')
          ok(ordera && orderb && orderc, 'done listen for readiness by id')
        })
      })

      test('done function', 3, function () {
        var count = 0
        ok(count == 0, '0')
        script.ready(['a', 'b'], function () { ok(++count == 2, '2') })
        script.ready('a', function () { ok(++count == 1, '1') })
        script.done('a')
        script.done('b')
      })

      test('double loaded files', function (done) {
        var count = 0
        function load () {
          if (++count == 2) {
            ok(true, 'loaded callbacks twice')
            done()
          }
        }
        script('double-load', load)
        script('double-load', load)
      })

      test('correctly count loaded scripts', function (done){
        script.path('../vendor/')
        script(['patha', 'pathb', 'http://ded.github.com/morpheus/morpheus.js', 'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.js'], function () {
          ok(typeof angular !== 'undefined', 'loaded angular.js from http')
          done();
        })
      })

      test('double loaded file in different loading list', 2, function() {
        script(['../vendor/lab2.js', '../vendor/lab2.min.js'], function() {
          ok(true, 'lab2 and lab2.min have been loaded')
        })
        script(['../vendor/lab2.js', '../vendor/head.js'], function() {
          ok(true, 'lab2 and head have been loaded')
        })
      })

    })
    start()
  })
})
