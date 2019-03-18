import * as d3 from 'd3';

import * as eventHandlers from './vurvCollabEventHandlers';

import {parsedData, dataParser} from 'utility/dataParser';
import {getColorArray} from 'utility/getColorArray';
import {d3WordWrap} from 'utility/d3WordWrap';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {outerR, baseInit, appendMemberLabel} from 'base/base';
import {getShuffledArray} from 'utility/getShuffledArray';

const svg = d3.select('#vurv-collab-svg');
const height = outerR * 1.25;
const width = outerR * 2;

let memberKeys = [];
let connections = {};
let memberPosLookup = {};
let colorsArray = [];

export function setup() {
	baseInit('#vurv-collab-svg', false, height);
	memberKeys = getShuffledArray(dataParser.getConnectionKeys('vurv-collaboration'));
	connections = dataParser.getConnections('vurv-collaboration');
	colorsArray = getColorArray(memberKeys.length);

	const members = svg.select('.members');

	const collaboration = memberKeys.map((key, i, arr) => {
		let obj = {
			member: key,
			x: ((i + 1)/arr.length * (width - 160)) + 40, 
			y: Math.cos(i/2) * 250 + height/2
			//y: Math.random() * (height - 40) + 20
		}

		memberPosLookup[key] = obj;

		return obj;
	})

	const nodes = members.selectAll('.members-node')
		.data(collaboration)
		.enter()
		.append('g')
		.attr('class', 'members-node')
		.on('mouseover', eventHandlers.handleMouseOverMember)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, memberKeys))
		.attr('data-member', (d) => { return d.member; })
		.attr('transform', (d) => { return `translate(${d.x},${height/2})`; })

	nodes.append('circle')
		.style('fill', 'rgb(80,80,80)')
		.attr('r', 20)
		.attr('class', 'members-node-circle')
		.each(appendMemberLabel);

	setLinks();
}

export function init() {	
	setTimeout(() => {	
		update();
	}, 100)
}

function setLinks() {
	const lines = svg.select('.links');
	const memberLinkGroup = lines.selectAll('.links-node')
		.data(memberKeys.filter((el) => { return memberPosLookup[el]; }))
		.enter()
		.append('g')
		.attr('class', 'links-node')
		.attr('data-member', (d) => { return d; })
		.attr('data-index', (d,i) => { return i; })

	memberLinkGroup.selectAll('.links-node-line')
		.data((d) => { return (connections[d] || []).filter((el) => { return memberPosLookup[el]; }); })
		.enter()
		.append('line')
		.attr('class','links-node-line')
		.attr('data-from', (d) => { return d; })
		.attr('data-to', (d,i,j) => { return j[i].parentNode.getAttribute('data-member'); })
		.style('stroke', (d,i,j) => { return colorsArray[j[i].parentNode.getAttribute('data-index')]; })
		.attr('x1', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].x; })
		.attr('y1', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].y; })
		.attr('x2', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].x; })
		.attr('y2', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].y; })
}

function update() {
	svg.selectAll('.members-node')
		.transition()
		.attr('transform', (d) => { return `translate(${d.x},${d.y})`; })
		.delay((d,i) => { return i*40; })
		.duration(800)

	svg.selectAll('.members-node circle')
		.transition()
		.style('fill', '#fff')
		.duration(800)

	svg.selectAll('.links-node line')
		.transition()
		.attr('x1', (d) => { return memberPosLookup[d].x; })
		.attr('y1', (d) => { return memberPosLookup[d].y; })
		.attr('x2', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].x; })
		.attr('y2', (d,i,j) => { return memberPosLookup[j[i].parentNode.getAttribute('data-member')].y; })
		.delay((d,i,j) => { return j[i].parentNode.getAttribute('data-index')*50 + memberKeys.length*30; })
		.duration(800)
}

export default {init, setup}