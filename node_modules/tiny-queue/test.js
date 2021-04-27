#!/usr/bin/env node

var Queue = require('./');
var test = require('tape');

function init(queue) {
  queue.push(1);
  queue.push(2);
  queue.push(3);
  queue.push(4);
  return queue;
}

test('slice test', function (t) {

  var queues = [new Queue(), new Array()];

  queues.forEach(function (queue) {
    init(queue);

    t.deepEqual(queue.slice(), [1, 2, 3, 4]);
    t.deepEqual(queue.slice(2), [3, 4]);
    t.deepEqual(queue.slice(1), [2, 3, 4]);
    t.deepEqual(queue.slice(3), [4]);
    t.deepEqual(queue.slice(4), []);
    t.deepEqual(queue.slice(5), []);
    t.deepEqual(queue.slice(0, 1), [1]);
    t.deepEqual(queue.slice(0, 2), [1, 2]);
    t.deepEqual(queue.slice(0, 3), [1, 2, 3]);
    t.deepEqual(queue.slice(0, 4), [1, 2, 3, 4]);
    t.deepEqual(queue.slice(0, 5), [1, 2, 3, 4]);
    t.deepEqual(queue.slice(1, 2), [2]);
    t.deepEqual(queue.slice(1, 3), [2, 3]);
    t.deepEqual(queue.slice(1, 4), [2, 3, 4]);
    t.deepEqual(queue.slice(2, 3), [3]);
    t.deepEqual(queue.slice(2, 4), [3, 4]);
    t.deepEqual(queue.slice(2, 5), [3, 4]);
  });

  t.end();

});

