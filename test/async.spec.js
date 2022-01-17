import benchmark from "../index.node.js";
import test from "tape";

test("[async] benchmark a simple function", async (t) => {
  const result = await benchmark(
    function (done) {
      for (let i = 0; i < 1000; i++) {}
      done();
    },
    undefined,
    10,
  );
  t.ok(result.count > 0, `count > 0, ${result.count}`);
  t.ok(result.mean >= 0, `mean >= 0, ${result.mean}`);
  t.ok(result.max >= 0, `max >= 0, ${result.max}`);
  t.ok(result.min >= 0, `min >= 0, ${result.min}`);
});

test("[async] benchmark a function with setup", async (t) => {
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
  t.ok(result.count > 0, `count > 0, ${result.count}`);
  t.ok(result.mean >= 0, `mean >= 0, ${result.mean}`);
  t.ok(result.max >= 0, `max >= 0, ${result.max}`);
  t.ok(result.min >= 0, `min >= 0, ${result.min}`);
});

test("[async] duration changes the number of samples", async (t) => {
  const func = function (done) {
    for (let i = 0; i < 1000; i++) {}
    done();
  };
  const result = await benchmark(func, undefined, 100);
  const result2 = await benchmark(func, undefined, 300);
  t.ok(result2.count > result.count, `result2.count > result.count, ${result2.count}, ${result.count}`);
});
