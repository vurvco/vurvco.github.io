export default function getColorArray(size) {
	let rainbow = new Array(size);
	let red;
	let blue;
	let green;
	let i;

	for (i=0; i<size; i++) {
	  red   = sin_to_hex(i, 0 * Math.PI * 0.2, size);
	  blue  = sin_to_hex(i, 1 * Math.PI * 0.7, size);
	  green = sin_to_hex(i, 2 * Math.PI * 0.4, size);

	  rainbow[i] = "#"+ red + green + blue;
	}

	return rainbow;
}

function getAccesibleTextColor(hex){
	
	threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */
	
	hRed = hexToR(hex);
	hGreen = hexToG(hex);
	hBlue = hexToB(hex);
	

	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

	cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
	  if (cBrightness > threshold){return "#000000";} else { return "#ffffff";}	
  }

function sin_to_hex(i, phase, size) {
  const sin = Math.sin(Math.PI / size * 2 * i + phase);
  const num = Math.floor(sin * 127) + 128;
  const hex = num.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

export {getColorArray, getAccesibleTextColor}