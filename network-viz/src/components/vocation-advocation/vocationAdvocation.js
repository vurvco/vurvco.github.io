import * as d3 from 'd3';

import {parsedData, dataParser} from 'utility/dataParser';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {d3WordWrap} from 'utility/d3WordWrap';
import {outerR} from 'base/base';

// let vocationDataSet = [];
// let advocationDataSet = [];

export function init() {
	// d3.selectAll('.identities-node')
	// 	.data([{identity: 'text'}])
	// 	.exit()
	// 	.remove();

	console.log(parsedData)

	//setDataSets();

	//removeOldNodes();

	//setTimeout(() => {
		d3.select('#viz')
			.attr('data-view', 'vocation-advocation')
	//}, 1000)

	setTimeout(() => {
		setNewNodes()
		setLinks()
	}, 1200)
}

function removeOldNodes() {
	d3.selectAll('.links-node-line')
		.transition()		
		.attr('x1', function(d) { return (d.start[0] + d.end[0])/2; })
		.attr('y1', function(d) { return (d.start[1] + d.end[1])/2; })
		.attr('x2', function(d) { return (d.start[0] + d.end[0])/2; })
		.attr('y2', function(d) { return (d.start[1] + d.end[1])/2; })
		.duration(600)
		.remove();

	d3.selectAll('.identities-node')
		.data([])
		.exit()
		.transition()		
		.duration(800)
		.remove()
		.select('circle')
		.attr('r', 0);

	// d3.selectAll('.members-node')
	// 	.transition()
	// 	.attr('transform', (d) => { return 'translate(' + getPositionX(outerR, 0.35, d.angle) + ', ' + getPositionY(outerR, 0.35, d.angle) + ')'})
	// 	.duration(800);

	d3.selectAll('.members-node')
		.transition()
		.attr('transform', (d,i) => { return 'translate(' + outerR + ', ' + ((i/parsedData.rows.length) * (outerR * 2) + 50)  + ')'})
		.duration(1000);
}

function setNewNodes() {
	const identities = d3.select('.identities');
		
	identities.selectAll('.vocation-node')
		.data(dataParser.getConnectionKeys('vocation'))
		.enter()
		.append('g')
			.attr('class', 'vocation-node')
			.attr('transform', 'translate(' + outerR/15 + ',0)')
		.append('rect')
			.style('fill', 'yellow')
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
			.style('fill', '#ffc107')
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

	d3.selectAll('.members-node')
		.attr('transform', (d,i) => { return 'translate(' + getMemberPosX() + ', ' + getMemberPosY(i) + ')'})

	d3.selectAll('.members-node-circle')
		.transition()
		.delay(function(d,i) { return 1000 + (300 * i); })
		.attr('r', outerR/25)	
		.duration(1000)

	d3.selectAll('.members-node-label')
		.transition()
		.delay(function(d,i) { return 1300 + (300 * i); })
		.style('opacity', 1)		
		.duration(400)
}

// function setDataSets() {
// 	const allVocationKeys = dataParser.getConnectionKeys('vocation');
// 	const allAdvocationKeys = dataParser.getConnectionKeys('advocation');
// 	let angle, x, y;
// 	vocationDataSet = allVocationKeys.map((el, i) => {
// 		angle = Math.PI/2 + (i / ((allVocationKeys.length - 1)/2)) * Math.PI/2;
// 		x = getPositionX(outerR, 0.82, angle);
// 		y = getPositionY(outerR, 0.82, angle);
// 		return {
// 			identity: el,
// 			i: i,
// 			angle: angle,
// 			position: [x - outerR/10, y],
// 			members: parsedData.connections['vocation'][el]
// 		}
// 	});

// 	advocationDataSet = allAdvocationKeys.map((el, i) => {
// 		angle = Math.PI/2 + (i / ((allAdvocationKeys.length - 1)/2)) * Math.PI/2;
// 		x = getPositionX(outerR, 0.82, angle);
// 		y = getPositionY(outerR, 0.82, angle);
// 		return {
// 			identity: el,
// 			i: i,
// 			angle: angle,
// 			position: [x - outerR/10, y],
// 			members: parsedData.connections['vocation'][el]
// 		}
// 	});
// }

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
	// const connections = dataParser.getConnections('vocation');
	// const members = dataParser.getMembers();
	// const linksData = dataParser.getConnectionKeys('vocation').map((vocation,i) => {
	// 	console.log(vocation, connections)
	// 	return {
	// 		start: [],
	// 		end: [getMemberPosX(), getMemberPosY(1)]
	// 	}
	// })

	// console.log(linksData)

	// let links = d3.select('.links')
	// 	.selectAll('.links-node')
	// 	.data(dataParser.getConnections('vocation'))
	// 	.enter()
	// 	.append('g')
	// 	.attr('class', 'links-node');

	// links.selectAll('links-node-line')
	// 	.data(getLinkData)
	// 	.enter()
	// 	.append('line')
	// 	.attr('class', 'links-node-line')
	// 	.style('stroke', 'yellow')
	// 	.attr('x1', (d) => { return getAdvocationPosX(); })
	// 	.attr('y1', (d,i) => { return getAdvocationPosY(i); })
	// 	.attr('x2', (d) => { return getMemberPosX(); })
	// 	.attr('y2', (d,i) => { return getMemberPosY(i); });

	let linksVocation = d3.select('.links')
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
		.style('stroke', 'yellow')
		.attr('x1', (d) => { return d.start[0] + 230; })
		.attr('y1', (d) => { return d.start[1] + 20; })
		.attr('x2', (d) => { return d.start[0] + 230 })
		.attr('y2', (d) => { return d.start[1] + 20; });

	let linksAdvocation = d3.select('.links')
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
		.style('stroke', '#ffc107')
		.attr('x1', (d) => { return d.start[0] - 10; })
		.attr('y1', (d) => { return d.start[1] + 20; })
		.attr('x2', (d) => { return d.start[0] - 10; })
		.attr('y2', (d) => { return d.start[1] + 20; });

	//setTimeout(() => {
		d3.selectAll('.links-node-line')
			.transition()
			.attr('x2', (d) => { return d.end[0]; })
			.attr('y2', (d) => { return d.end[1]; })
			.delay((d) => { return 1000 + (300 * d.index); })
			.duration(600);
	//}, dataParser.getConnectionKeys('vocation') * 140)
}

export default {init};