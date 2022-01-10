import Result from './result.js';
import _async from './async.js';
import _sync from './sync.js';

export const sync = (fn, setup, duration) => {
	const allSamples = [];
	let totalCount = 0;
	duration += Date.now();
	
	// We measure in chunks of 100ms to periodically work the garbage collector.
	// This acts like a "dither" to smooth out the fluctuating memory usage caused
	// by the benchmarking engine itself (https://en.wikipedia.org/wiki/Dither).
	do {
		_sync(() => {}, () => {}, 10); // Fake/dither benchmark
		const samples = _sync(fn, setup, 100); // Actual benchmark
		allSamples.push(samples);
		totalCount += samples.length;
	} while (Date.now() < duration || totalCount < 10)
	
	return new Result([].concat(...allSamples));
};

export const async = (fn, setup, duration) => {
	const allSamples = [];
	let totalCount = 0;
	duration += Date.now();
	
	// Here we do the same thing as commented in sync().
	const dither = () => _async(cb => { cb(); }, cb => { cb(); }, 10);
	const actual = () => _async(fn, setup, 100);
	const loop = (samples) => {
		allSamples.push(samples);
		totalCount += samples.length;
		if (Date.now() < duration || totalCount < 10) return dither().then(actual).then(loop);
		return new Result([].concat(...allSamples));
	};
	
	return dither().then(actual).then(loop);
};

