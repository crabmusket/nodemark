import {performance} from 'perf_hooks';
globalThis.performance = performance;

import benchmark from '../index.js';
import test from 'tape';

test('[async] benchmark a simple function', async t => {
  let result = await benchmark(function(done) { for (let i = 0; i < 1000; i++) {} done(); }, undefined, 10);
  t.ok(result.count > 0);
  t.ok(result.mean >= 0);
  t.ok(result.max >= 0);
  t.ok(result.min >= 0);
});

test('[async] benchmark a function with setup', async t => {
  let iters = 0;
  let result = await benchmark(
    function(done) { for (let i = 0; i < iters; i++) {} done(); },
    function() { iters = 500 + Math.random() * 1000; },
    10
  );
  t.ok(result.count > 0);
  t.ok(result.mean >= 0);
  t.ok(result.max >= 0);
  t.ok(result.min >= 0);
});