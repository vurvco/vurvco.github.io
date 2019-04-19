import * as d3 from 'd3';

import * as eventHandlers from './vocationAvocationEventHandlers';

import {parsedData, dataParser} from 'utility/dataParser';
import {getColorArray} from 'utility/getColorArray';
import {d3WordWrap} from 'utility/d3WordWrap';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {outerR, baseInit} from 'base/base';

const svg = d3.select('#vocation-avocation-svg');

let identityPosLookup = {};
let memberPosLookup = {};

let allIdentityKeys = [];
let allVocationKeys = [];
let allAvocationKeys = [];
let colorsArray = [];

let _activeView = 'vocation';

export function getActiveView() {
	return _activeView;
}

export function setup() {
	baseInit('#vocation-avocation-svg');
	allVocationKeys = dataParser.getConnectionKeys('vocation').sort().reverse();
	allAvocationKeys = dataParser.getConnectionKeys('avocation').sort().reverse();

	allIdentityKeys = allVocationKeys.slice();
	allAvocationKeys.forEach((el,i) => {
		if (allIdentityKeys.indexOf(el) === -1) {
			allIdentityKeys.push(el);
		}
	})
	allIdentityKeys.sort().reverse();

	colorsArray = getColorArray(allIdentityKeys.length);

	setIdentityPosLookup();
	
	const identities = svg.select('.identities');

	identities.selectAll('.identities-node')
		.data(getActiveViewKeys())
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

	d3.select('.vocation-avocation-toggle-view')
		.on('click', toggleView)
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
		.attr('r', outerR/10)
		.style('fill', function(d) { return colorsArray[allIdentityKeys.indexOf(d)]; })
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

	updateLinks();
}

function setActiveIdentities() {
	let identities = svg.select('.identities')
		.selectAll('.identities-node')
		.data(getActiveViewKeys(), (d) => { return d; })

	setIdentityPosLookup();

	identities.exit().remove();

	identities.enter().append('g')
		.attr('class', 'identities-node')
		.on('mouseover', eventHandlers.handleMouseOverIdentity)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, allIdentityKeys))
		.attr('data-enter', 'true')		
		.attr('transform', (d) => { return 'translate(' + identityPosLookup[d][0] + ', ' + identityPosLookup[d][1] + ')'})
		.append('circle')	
		.attr('class', 'identities-node-circle')
		.attr('r', 0)
		.style('fill', function(d) { return colorsArray[allIdentityKeys.indexOf(d)]; })

	svg.selectAll('.identities-node')
		.transition()
		.attr('transform', (d) => { return 'translate(' + identityPosLookup[d][0] + ', ' + identityPosLookup[d][1] + ')'})
		.duration(800)

	svg.selectAll('.identities-node-circle')
		.transition()
		.attr('r', outerR/10)
		.duration(600)

	svg.selectAll('.identities-node[data-enter="true"]')
		.append('text')
		.style('opacity', 0)
		.text((d) => { return d; })
		.call(d3WordWrap)

	svg.selectAll('.identities-node[data-enter="true"] text')
		.transition()
		.style('opacity', 1)
		.duration(600)

	setLinks();
	updateLinks();
}

function setIdentityPosLookup() {
	const connections = dataParser.getConnections(getActiveView());
	let angle, x, y;
	const activeViewKeys = getActiveViewKeys();
	
	activeViewKeys.forEach((identity, i) => {
		angle = (i / (activeViewKeys.length/2)) * Math.PI;
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
		.data(getActiveViewKeys(), (d) => { return d; })
		.enter()
		.append('g')
		.attr('class', 'links-node');

	let linkLines = links.selectAll('links-node-line')
		.data(getLinkData);

	linkLines.enter()
		.append('line')
		.attr('class', 'links-node-line')
		.style('stroke', (d) => { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.attr('x1', (d) => { return identityPosLookup[d.identity][0]; })
		.attr('y1', (d) => { return identityPosLookup[d.identity][1]; })
		.attr('x2', (d) => { return identityPosLookup[d.identity][0]; })
		.attr('y2', (d) => { return identityPosLookup[d.identity][1]; });
}

function updateLinks() {
	svg.selectAll('.links-node-line')
		.transition()		
		.attr('x1', (d) => { return identityPosLookup[d.identity][0]; })
		.attr('y1', (d) => { return identityPosLookup[d.identity][1]; })
		.attr('x2', (d) => { return memberPosLookup[d.member][0]; })
		.attr('y2', (d) => { return memberPosLookup[d.member][1]; })
		.delay((d) => { return 1000 + (300 * d.index); })
		.duration(600);
}

function resetLinks() {
	svg.selectAll('.links-node-line')
		.transition()		
		.attr('x1', function(d) { return (d.start[0] + d.end[0])/2; })
		.attr('y1', function(d) { return (d.start[1] + d.end[1])/2; })
		.attr('x2', function(d) { return (d.start[0] + d.end[0])/2; })
		.attr('y2', function(d) { return (d.start[1] + d.end[1])/2; })
		.duration(1000);

	setTimeout(() => {			
		svg.selectAll('.links-node').remove();
	}, 1000)
}

function getLinkData(identity) {
	const members = dataParser.getMembers();
	const identities = dataParser.getConnections(getActiveView())[identity];

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

function getActiveViewKeys() {
	if (_activeView === 'vocation') {
		return allVocationKeys;
	} 
	return allAvocationKeys;
}

function toggleView() {
	_activeView =  getActiveView() === 'avocation' ? 'vocation' : 'avocation';

	d3.select(this)	
		.classed('active', !d3.select(this).classed('active'))

	resetLinks();
	
	setTimeout(() => {			
		setActiveIdentities();
	}, 1000)
}

export default {
	init, 
	setup, 
	getActiveView
}