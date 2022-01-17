import benchmark from "../index.node.js";
import test from "tape";

test("[sync] benchmark a simple function", (t) => {
  const result = benchmark(
    function () {
      for (let i = 0; i < 1000; i++) {}
    },
    undefined,
    10,
  );
  t.ok(result.count > 0, `count > 0, ${result.count}`);
  t.ok(result.mean >= 0, `mean >= 0, ${result.mean}`);
  t.ok(result.max >= 0, `max >= 0, ${result.max}`);
  t.ok(result.min >= 0, `min >= 0, ${result.min}`);
  t.end();
});

test("[sync] benchmark a function with setup", (t) => {
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
  t.ok(result.count > 0, `count > 0, ${result.count}`);
  t.ok(result.mean >= 0, `mean >= 0, ${result.mean}`);
  t.ok(result.max >= 0, `max >= 0, ${result.max}`);
  t.ok(result.min >= 0, `min >= 0, ${result.min}`);
  t.end();
});

test("[sync] duration changes the number of samples", (t) => {
  const func = function () {
    for (let i = 0; i < 1000; i++) {}
  };
  const result = benchmark(func, undefined, 100);
  const result2 = benchmark(func, undefined, 300);
  t.ok(result2.count > result.count, `result2.count > result.count, ${result2.count}, ${result.count}`);
  t.end();
});
