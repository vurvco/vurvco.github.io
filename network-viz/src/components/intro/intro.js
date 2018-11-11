import * as d3 from 'd3';

const svg = d3.select('#intro-svg');

import {outerR, baseInit} from 'base/base';

export function setup() {
	baseInit('#intro-svg');

	svg.selectAll('.components')
		.data(['tech', 'art'])
		.enter().append('g')
		.attr('class', 'components')		
		.attr('transform', 'translate(' + outerR + ', ' + outerR + ')')
		.append('circle')
		.attr('fill','rgb(80,80,80)')
		.attr('r', outerR/5)
}

export function init() {
	setTimeout(() => {
		svg.selectAll('.components')
			.transition()
			.attr('transform', (d) => { return 'translate(' + (outerR + ( d === 'tech' ? -outerR/4 : outerR/4)) + ', ' + outerR + ')'})
			.duration(600)

		svg.selectAll('.components')
			.append('text')
			.text((d) => { return d; })
	}, 1000)
}

export default {init, setup}