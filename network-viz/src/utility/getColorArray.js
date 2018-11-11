export default function getColorArray(size) {
	let rainbow = new Array(size);
	let red;
	let blue;
	let green;
	let i;

	for (i=0; i<size; i++) {
	  red   = sin_to_hex(i, 0 * Math.PI * 0.3, size);
	  blue  = sin_to_hex(i, 2 * Math.PI * 0.3, size);
	  green = sin_to_hex(i, 4 * Math.PI * 0.3, size);

	  rainbow[i] = "#"+ red + green + blue;
		
	}

	return rainbow.reverse();
}

function sin_to_hex(i, phase, size) {
  const sin = Math.sin(Math.PI / size * 2 * i + phase);
  const num = Math.floor(sin * 45) + 210;
  const hex = num.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

export {getColorArray}