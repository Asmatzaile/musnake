export const posMod = (n, mod) => (n % mod + mod) % mod;

export const lerp = (t, a, b) => a + t * (b - a);

export const poltocar = (r, theta) => {
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return [x, y];
}

const gcd = (a, b) => {
    if (b === 0) return a;
    else return gcd(b, (a%b));
}

export const randInt = (a, b) => {
    const [min, max] = b === undefined ? [0, a] : [a, b];
    return Math.floor(Math.random() * (max - min)) + min;
}

export const choose = (array, {weights}={}) => weights ? wchoose(array, weights) : array[randInt(array.length)];

// based on https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/statistics/weighted-random
const wchoose = (items, weights) => {
    if (items.length !== weights.length) throw new Error('Items and weights must be of the same size');
    if (!items.length) throw new Error('Items must not be empty');

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0); // Calculate the total sum of weights.
    const threshold = totalWeight * Math.random();

    let cumulative = 0;
    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i];
      if (cumulative >= threshold) return items[i];
    }
}

const rotateArray = (array, rotation) => {
    const n = array.length;
    const rotatedArray = Array(n);
    
    //	Check for sanity
    rotation = (rotation % n + n) % n;
    
    for (let i = 0; i < n; i++) {
        const element = array[i];
        const newIndex = (i + rotation) % n;
        rotatedArray[newIndex] = element;
    }
    return rotatedArray;
}

export const getACoprime = (number, min, max, {skip=[]}={}) => {
    let candidates = [];
    for (let i = min; i < max; i++) candidates.push(i);
    skip = new Set([skip].flat(Infinity));
    candidates = candidates.filter(val => gcd(val, number) === 1 && !skip.has(val));
    return choose(candidates);
}

// the good old http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf
export const euclid = (pulses, steps, offset=0) => {
    if (pulses > steps) throw new Error(`More pulses (${pulses}) than steps (${steps})!`);

    const bjorklundArray = Array(steps);
	let lastTruncated = 0;
	for (let i = 1; i <= steps; i++) {	
		const truncatedValue = Math.floor((i * pulses)/steps);
		const bjorklundValue = truncatedValue - lastTruncated;
		lastTruncated = truncatedValue;
		
		const index = (i==steps) ? 0 : i;	// puts the last element first
		bjorklundArray[index] = bjorklundValue;
	}

    return rotateArray(bjorklundArray, offset);
}
