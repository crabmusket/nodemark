export default (fn, setup, duration) => {
	const noop = () => {};
	const samples = [];
	duration += Date.now();
	
	do {
		setup();
		const t0 = performance.now();
		noop(); // Measure the noop time so we can factor it out
		const t1 = performance.now();
		fn();
		const t2 = performance.now();
		samples.push((t2 - t1 - (t1 - t0)) * 1e6);
	} while (Date.now() < duration);
	
	return samples;
};
