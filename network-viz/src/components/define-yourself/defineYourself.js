import * as d3 from 'd3';

import * as eventHandlers from './defineYourselfEventHandlers';

import {parsedData, dataParser} from 'utility/dataParser';
import {getColorArray} from 'utility/getColorArray';
import {d3WordWrap} from 'utility/d3WordWrap';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {outerR, baseInit} from 'base/base';

const svg = d3.select('#define-yourself-svg');

let identityPosLookup = {};
let memberPosLookup = {};

let allIdentityKeys = [];
let colorsArray = [];

export function setup() {
	baseInit('#define-yourself-svg');
	allIdentityKeys = dataParser.getConnectionKeys('define-yourself').reverse();
	colorsArray = getColorArray(allIdentityKeys.length);

	setIdentityPosLookup();

	const identities = svg.select('.identities');

	identities.selectAll('.identities-node')
		.data(allIdentityKeys)
		.enter().append('g')
		.attr('class', 'identities-node')		
		.attr('transform', 'translate(' + outerR + ', ' + outerR + ')')

	identities.selectAll('.identities-node')
		.append('circle')
		.attr('class', 'identities-node-circle')
		.style('fill', 'rgb(80,80,80)')
		.attr('r', outerR/5)
}

export function init() {	
	setMemberPosLookup();

	setTimeout(() => {	
		setLinks();
		update();
	}, 100)
}

function update() {
	svg.selectAll('.identities-node')
		.on('mouseover', eventHandlers.handleMouseOverIdentity)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, allIdentityKeys))
		.transition()
		.attr('transform', (d) => { return 'translate(' + identityPosLookup[d][0] + ', ' + identityPosLookup[d][1] + ')'})
		.duration(1500);

	svg.selectAll('.identities-node')
		.append('text')
		.style('opacity', 0)
		.text((d) => { return d; })
		.enter();

	svg.selectAll('.identities-node text')
		.call(d3WordWrap)

	svg.selectAll('.identities-node')
		.select('text')
		.transition()
		.style('opacity', 1)
		.duration(1500);

	svg.selectAll('.identities-node')
		.select('circle')
		.transition()
		.attr('r', outerR/12)
		.style('fill', function(d, i) { return colorsArray[i]; })
		.duration(1500);

	svg.selectAll('.members-node')
		.on('mouseover', eventHandlers.handleMouseOverMember)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, allIdentityKeys))
		.attr('transform', (d) => { return 'translate(' + memberPosLookup[d][0] + ', ' + memberPosLookup[d][1] +')'})
		.select('.members-node-circle')
			.transition()
			.attr('r', outerR/25)
			.delay(function(d,i) { return 1000 + (300 * i); })
			.duration(600)
			//.on('end', appendMemberLabel);

	svg.selectAll('.links-node-line')
		.transition()		
		.attr('x1', (d) => { return d.start[0]; })
		.attr('y1', (d) => { return d.start[1]; })
		.attr('x2', (d) => { return d.end[0]; })
		.attr('y2', (d) => { return d.end[1]; })
		.delay((d) => { return 1000 + (300 * d.index); })
		.duration(600);
}

function setIdentityPosLookup() {
	let angle, x, y;
	
	allIdentityKeys.forEach((identity, i) => {
		angle = (i / (allIdentityKeys.length/2)) * Math.PI;
		x = getPositionX(outerR, 0.87, angle);
		y = getPositionY(outerR, 0.87, angle);

		identityPosLookup[identity] = [x, y];
	});
}

function setMemberPosLookup() {
	let vertices;
	let pos;
	
	dataParser.getMembers().forEach((name, i) => {
		let angle = (i / (parsedData.rows.length/2)) * Math.PI;
		pos = [
			getPositionX(outerR, 0.45, angle),
			getPositionY(outerR, 0.45, angle)
		]

		memberPosLookup[name] = pos;
	})
}

function setLinks() {
	let links = svg.select('.links')
		.selectAll('.links-node')
		.data(allIdentityKeys)
		.enter()
		.append('g')
		.attr('class', 'links-node');

	links.selectAll('links-node-line')
		.data(getLinkData)
		.enter()
		.append('line')
		.attr('class', 'links-node-line')
		.style('stroke', (d) => { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.attr('x1', (d) => { return d.start[0]; })
		.attr('y1', (d) => { return d.start[1]; })
		.attr('x2', (d) => { return d.start[0]; })
		.attr('y2', (d) => { return d.start[1]; });
}

function getLinkData(identity) {
	const members = dataParser.getMembers();
	const identities = dataParser.getConnections('define-yourself')[identity];

	return identities.map((member, i) => {
		return {
			end: memberPosLookup[member],
			start: identityPosLookup[identity],
			identity: identity,
			member: member,
			index: members.indexOf(member)
		}
	})
}

export default {init, setup}