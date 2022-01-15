import {performance} from 'perf_hooks';
globalThis.performance = performance;

import benchmark from '../index.js';
import test from 'tape';

test('[sync] benchmark a simple function', t => {
  let result = benchmark(function() { for (let i = 0; i < 1000; i++) {} }, undefined, 10);
  t.ok(result.count > 0);
  t.ok(result.mean >= 0);
  t.ok(result.max >= 0);
  t.ok(result.min >= 0);
  t.end();
});

test('[sync] benchmark a function with setup', t => {
  let iters = 0;
  let result = benchmark(
    function() { for (let i = 0; i < iters; i++) {} },
    function() { iters = 500 + Math.random() * 1000; },
    10
  );
  t.ok(result.count > 0);
  t.ok(result.mean >= 0);
  t.ok(result.max >= 0);
  t.ok(result.min >= 0);
  t.end();
});

test('[sync] duration changes the number of samples', t => {
  let func = function() { for (let i = 0; i < 1000; i++) {} };
  let result = benchmark(func, undefined, 100);
  let result2 = benchmark(func, undefined, 300);
  t.ok(result2.count > result.count);
  t.end();
});