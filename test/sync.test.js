import benchmark from "../index.js";
import { assert } from "https://deno.land/std@0.121.0/testing/asserts.ts";

Deno.test("[sync] benchmark a simple function", () => {
  const result = benchmark(
    function () {
      for (let i = 0; i < 1000; i++) {}
    },
    undefined,
    10,
  );
  assert(result.count > 0, "count > 0");
  assert(result.mean >= 0, "mean >= 0");
  assert(result.max >= 0, "max >= 0");
  assert(result.min >= 0, "min >- 0");
});

Deno.test("[sync] benchmark a function with setup", () => {
  let iters = 0;
  const result = benchmark(
    function () {
      for (let i = 0; i < iters; i++) {}
    },
    function () {
      iters = 500 + Math.random() * 1000;
    },
    10,
  );
  assert(result.count > 0, "count > 0");
  assert(result.mean >= 0, "mean >= 0");
  assert(result.max >= 0, "max >= 0");
  assert(result.min >= 0, "min >- 0");
});

Deno.test("[sync] duration changes the number of samples", () => {
  const func = function () {
    for (let i = 0; i < 1000; i++) {}
  };
  const result = benchmark(func, undefined, 100);
  const result2 = benchmark(func, undefined, 300);
  assert(result2.count > result.count, "result2.count > result.count");
});
