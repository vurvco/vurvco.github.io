import * as d3 from 'd3';

import {dataParser} from 'utility/dataParser';

const viewBox = Math.min(window.innerWidth, window.innerHeight);
export const outerR = 650; 

export function init() {
	const svg = d3.select('#viz');

	svg.attr('data-view', 'define-yourself')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.append('g')
		.attr('class', 'links');

	svg.append('g')
		.attr('class', 'members');

	svg.attr('viewBox', '0 0 ' + outerR*2 + ' ' + outerR*2)
		.append('g')
		.attr('class', 'identities');

	setMembers();
}

function setMembers() {
	const members = d3.select('.members');

	members.selectAll('.members-node')
		.data(dataParser.getMembers())
		.enter()
		.append('g')
		.attr('class', 'members-node')		
		.append('circle')
		.attr('class', 'members-node-circle')
		.attr('r', 0)
		.each(appendMemberLabel);
}

function appendMemberLabel(d, i) {
	const member = d3.select(this.parentNode);
	let bbox;

	member.append('g')
		.attr('class', 'members-node-label')
		.append('rect');

	const text = member.select('.members-node-label')
		.append('text')
		.text(d);

	bbox = text.node().getBBox();

	member.select('rect')
		.attr('width', bbox.width + 40)
		.attr('height', bbox.height + 10)
		.attr('x', bbox.x - 20)
		.attr('y', bbox.y - 5)
}

export default {outerR, init};