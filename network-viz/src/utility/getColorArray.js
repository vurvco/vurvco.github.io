export default function getColorArray(size) {
	//let rainbow = new Array(size);
	// let red;
	// let blue;
	// let green;
	//let i;

	//for (i=0; i<size; i++) {
	//   red   = sin_to_hex(i, 0 * Math.PI * 0.2, size);
	//   blue  = sin_to_hex(i, 1 * Math.PI * 0.7, size);
	//   green = sin_to_hex(i, 2 * Math.PI * 0.4, size);

	//   rainbow[i] = "#"+ red + green + blue;
	console.log(size)
		return makeColorGradient(.3,.3,.3,0,2,4, 200,55,size);
	//}
}

function sin_to_hex(i, phase, size) {
  const sin = Math.sin(Math.PI / size * 2 * i + phase);
  const num = Math.floor(sin * 127) + 128;
  const hex = num.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

 function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) { 
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    console.log(len)

    let rainbow = new Array(len);
    let red;
    let green; 
    let blue;

    for (var i = 0; i < len; ++i)
    {
       red = Math.sin(frequency1*i + phase1) * width + center;
       green = Math.sin(frequency2*i + phase2) * width + center;
       blue = Math.sin(frequency3*i + phase3) * width + center;

       rainbow[i] = RGB2Color(red, green, blue);
    }

    console.log(rainbow)

    return rainbow;
  }

  function RGB2Color(r,g,b)
  {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

   function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

export {getColorArray}