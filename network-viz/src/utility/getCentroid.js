export default function getCentroid(vertices) {
	let x = 0;
	let y = 0;

	vertices.forEach((el, i) => {
		x += el[0];
		y += el[1];
	})
	return [
		x/vertices.length,
		y/vertices.length
	]	
}

export {getCentroid};