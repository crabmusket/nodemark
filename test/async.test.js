import benchmark from "../index.js";
import { assert } from "https://deno.land/std@0.121.0/testing/asserts.ts";

Deno.test("[async] benchmark a simple function", async () => {
  const result = await benchmark(
    function (done) {
      for (let i = 0; i < 1000; i++) {}
      done();
    },
    undefined,
    10,
  );
  assert(result.count > 0, `count > 0, ${result.count}`);
  assert(result.mean >= 0, `mean >= 0, ${result.mean}`);
  assert(result.max >= 0, `max >= 0, ${result.max}`);
  assert(result.min >= 0, `min >= 0, ${result.min}`);
});

Deno.test("[async] benchmark a function with setup", async () => {
  let iters = 0;
  const result = await benchmark(
    function (done) {
      for (let i = 0; i < iters; i++) {}
      done();
    },
    function () {
      iters = 500 + Math.random() * 1000;
    },
    10,
  );
  assert(result.count > 0, `count > 0, ${result.count}`);
  assert(result.mean >= 0, `mean >= 0, ${result.mean}`);
  assert(result.max >= 0, `max >= 0, ${result.max}`);
  assert(result.min >= 0, `min >= 0, ${result.min}`);
});

Deno.test("[async] duration changes the number of samples", async () => {
  const func = function (done) {
    for (let i = 0; i < 1000; i++) {}
    done();
  };
  const result = await benchmark(func, undefined, 100);
  const result2 = await benchmark(func, undefined, 300);
  assert(result2.count > result.count, `result2.count > result.count, ${result2.count}, ${result.count}`);
});
