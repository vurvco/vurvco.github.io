import * as d3 from 'd3';

export default function d3WordWrap(text) {
  text.each(function() {
	let el = d3.select(this);

	let words = el.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		dy = 0,
		tspan = el.text(null).append("tspan").attr("x", 0).attr("y", 0).attr("dy", dy + "em");

		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = el.append("tspan").attr("x", 0).attr("y", 0).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
			lineNumber += 1;
		}
	})
}

export {d3WordWrap}