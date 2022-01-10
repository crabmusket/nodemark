const async = (fn, setup, duration, callback) => {
	const { nextTick } = process;
	const noop = cb => { cb(); };
	const samples = [];
	duration += Date.now();
	
	let t0;
	let t2;
	let noise = 0;
	let currentId = 0;
	
	const setupDone = (id) => (err) => {
		if (id !== currentId) return callback(new TypeError('The benchmark setup callback was invoked twice'));
		if (err) return callback(err);
		const noopCallback = noopDone(++currentId);
		t0 = performance.now();
		noop(noopCallback);
	};
	
	// We measure the noop function so we can factor it out later.
	// Much of the logic in this function is unnecessary for the noop case, but we
	// keep it to ensure that v8 doesn't optimize this function too differently.
	const noopDone = (fake1) => (fake2) => {
		const t1 = performance.now();
		if (fake1 !== currentId) return callback(new TypeError('THIS SHOULD NEVER HAPPEN'));
		if (fake2) return callback(fake2);
		noise = (t1 - t0) * 1e6;
		const subjectCallback = subjectDone(++currentId);
		t2 = performance.now();
		fn(subjectCallback);
	};
	
	const subjectDone = (id) => (err) => {
		const t3 = performance.now();
		if (id !== currentId) return callback(new TypeError('The benchmark subject callback was invoked twice'));
		if (err) return callback(err);
		samples.push((t3 - t2) * 1e6 - noise);
		currentId += 1;
		if (Date.now() < duration) nextTick(runIteration);
		else callback(null, samples);
	};
	
	const runIteration = () => { setup(setupDone(currentId)); };
	nextTick(runIteration);
};

export default (fn, setup, duration) => {
  let callback;
  const promise = new Promise((resolve, reject) => { callback =
    (err, samples) => err ? reject(err) : resolve(samples); });
  async(fn, setup, duration, callback);
  return promise;
};
