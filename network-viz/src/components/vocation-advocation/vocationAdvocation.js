import * as d3 from 'd3';

import {parsedData, dataParser} from 'utility/dataParser';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {d3WordWrap} from 'utility/d3WordWrap';
import {outerR, baseInit} from 'base/base';

const svg = d3.select('#vocation-advocation-svg');

export function init() {
	baseInit('#vocation-advocation-svg');

	setTimeout(() => {
		setNewNodes()
		setLinks()
	}, 600)
}

function setNewNodes() {
	const identities = svg.select('.identities');
		
	identities.selectAll('.vocation-node')
		.data(dataParser.getConnectionKeys('vocation'))
		.enter()
		.append('g')
			.attr('class', 'vocation-node')
			.attr('transform', 'translate(' + outerR/15 + ',0)')
		.append('rect')
			.attr('width', 220)
			.attr('height', 50)

	identities.selectAll('.vocation-node')
		.transition()
		.attr('transform', (d,i) => { return 'translate(' + getVocationPosX() + ', ' + getVocationPosY(i) + ')' })
		.ease(d3.easeLinear)
		.duration((d,i) => { return i*140; })

	identities.selectAll('.advocation-node')
		.data(dataParser.getConnectionKeys('advocation'))
		.enter()
		.append('g')
			.attr('class', 'advocation-node')
			.attr('transform', 'translate(' + (outerR*2 - outerR/15 - 220) + ',0)')
		.append('rect')
			.attr('width', 220)
			.attr('height', 50)

	identities.selectAll('.advocation-node, .vocation-node')
		.append('text')
			.text((d) => {return d})
			.attr('y', 28)
			.attr('x', 10)
			.style('text-anchor', 'start');

	identities.selectAll('.advocation-node text')
		.attr('x', 210)
		.style('text-anchor', 'end');

	identities.selectAll('.advocation-node')
		.transition()
		.attr('transform', (d,i) => { return 'translate(' + getAdvocationPosX() + ', ' + getAdvocationPosY(i) + ')' })
		.ease(d3.easeLinear)
		.duration((d,i) => { return i*140; })

	svg.selectAll('.members-node')
		.attr('transform', (d,i) => { return 'translate(' + getMemberPosX() + ', ' + getMemberPosY(i) + ')'})

	svg.selectAll('.members-node-circle')
		.transition()
		.delay(function(d,i) { return 1000 + (300 * i); })
		.attr('r', outerR/25)	
		.duration(1000)

	svg.selectAll('.members-node-label')
		.transition()
		.delay(function(d,i) { return 1300 + (300 * i); })
		.style('opacity', 1)		
		.duration(400)
}

function getVocationPosX() {
	return outerR/15;
}
function getVocationPosY(i) {
	return ((i/dataParser.getConnectionKeys('vocation').length) * (outerR * 2 - 60) + 30 + 25);
}
function getAdvocationPosX() {
	return (outerR*2 - outerR/15 - 220);
}
function getAdvocationPosY(i) {
	return ((i/dataParser.getConnectionKeys('advocation').length) * (outerR * 2 - 60) + 30 + 25);
}
function getMemberPosX() {
	return outerR;
}
function getMemberPosY(i) {
	return ((i/parsedData.rows.length) * (outerR * 2 - 100) + 100);
}

function getLinkData(type, vocationAdvocation, idx) {
	const members = dataParser.getMembers();
	const connections = dataParser.getConnections(type)[vocationAdvocation];

	return connections.map((member, i) => {
		return {
			end: [getMemberPosX(), getMemberPosY(members.indexOf(member))], 
			start: type === 'vocation' ?
				[getVocationPosX(), getVocationPosY(idx)]
				: [getAdvocationPosX(), getAdvocationPosY(idx)],
			vocationAdvocation: vocationAdvocation,
			member: member,
			index: members.indexOf(member)
		}
	})
}

function setLinks() {
	let linksVocation = svg.select('.links')
		.selectAll('.links-node.links-node-vocation')
		.data(dataParser.getConnectionKeys('vocation'))
		.enter()
		.append('g')
		.attr('class', 'links-node links-node-vocation');

	linksVocation.selectAll('links-node-line')
		.data(getLinkData.bind(this, 'vocation'))
		.enter()
		.append('line')
		.attr('class', 'links-node-line')
		.attr('x1', (d) => { return d.start[0] + 230; })
		.attr('y1', (d) => { return d.start[1] + 20; })
		.attr('x2', (d) => { return d.start[0] + 230 })
		.attr('y2', (d) => { return d.start[1] + 20; });

	let linksAdvocation = svg.select('.links')
		.selectAll('.links-node.links-node-advocation')
		.data(dataParser.getConnectionKeys('advocation'))
		.enter()
		.append('g')
		.attr('class', 'links-node links-node-advocation');

	linksAdvocation.selectAll('links-node-line')
		.data(getLinkData.bind(this, 'advocation'))
		.enter()
		.append('line')
		.attr('class', 'links-node-line')
		.attr('x1', (d) => { return d.start[0] - 10; })
		.attr('y1', (d) => { return d.start[1] + 20; })
		.attr('x2', (d) => { return d.start[0] - 10; })
		.attr('y2', (d) => { return d.start[1] + 20; });

	svg.selectAll('.links-node-line')
		.transition()
		.attr('x2', (d) => { return d.end[0]; })
		.attr('y2', (d) => { return d.end[1]; })
		.delay((d) => { return 1000 + (300 * d.index); })
		.duration(600);
}

export default {init};