import * as d3 from 'd3';

import * as eventHandlers from './defineYourselfEventHandlers';

import {parsedData} from './../../utility/dataParser';
import {getCentroid} from './../../utility/getCentroid';
import {getColorArray} from './../../utility/getColorArray';
import {d3WordWrap} from './../../utility/d3WordWrap';

const outerR = 650; 
const viewBox = Math.min(window.innerWidth, window.innerHeight);

let identityPosLookup = {};
let memberPosLookup = {};

let identitiesDataSet = [];
let membersDataSet = [];
let allMemberKeys = [];
let allIdentityKeys = [];
let colorsArray = [];

export function init() {
	allIdentityKeys = Object.keys(parsedData.connections['define-yourself']);
	allIdentityKeys.sort().reverse();

	setIdentitiesDataSet();
	setMemberDataSet();
	colorsArray = getColorArray(allIdentityKeys.length);

	d3.select('#viz')
		.attr('class', 'define-yourself')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.append('g')
		.attr('class', 'define-yourself-links');

	d3.select('#viz')
		.append('g')
		.attr('class', 'define-yourself-members');

	let svg = d3.select('#viz')
		.attr('viewBox', '0 0 ' + outerR*2 + ' ' + outerR*2)
		.append('g')
		.attr('class', 'define-yourself-identities');

	svg.selectAll('.define-yourself-identities-node')
		.data(identitiesDataSet)
		.enter().append('g')
		.attr('class', 'define-yourself-identities-node')
		.on('mouseover', eventHandlers.handleMouseOverIdentity)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, allIdentityKeys));
	
	svg.selectAll('.define-yourself-identities-node')
		.append('circle')
		.attr('class', 'define-yourself-identities-node-circle')
		.style('fill', 'rgb(80,80,80)')
		.attr('r', outerR/5);

	svg.selectAll('.define-yourself-identities-node')
		.attr('transform', function(d) { return 'translate(' + outerR + ', ' + outerR + ')'});

	setMembersNodes();
	setLinks();

	setTimeout(() => {
		update()
	}, 1000)
}

function update() {
	let svg = d3.select('.define-yourself-identities');

	d3.selectAll('.define-yourself-identities-node')
		.transition()
		.attr('transform', function(d) { return 'translate(' + d.x + ', ' + d.y + ')'})
		.duration(1500);

	svg.selectAll('.define-yourself-identities-node')
		.append('text')
		.style('opacity', 0)
		.text(function(d) { return d.identity; })
		.enter();

	svg.selectAll('.define-yourself-identities-node text')
		.call(d3WordWrap)

	svg.selectAll('.define-yourself-identities-node')
		.select('text')
		.transition()
		.style('opacity', 1)
		.duration(1500);

	d3.selectAll('.define-yourself-identities-node')
		.select('circle')
		.transition()
		.attr('r', outerR/10)
		.style('fill', function(d, i) { return colorsArray[i]; })
		.duration(1500);

	d3.selectAll('.define-yourself-members-node-circle')
		.transition()
		.attr('r', outerR/25)
		.delay(function(d,i) { return 1000 + (300 * d.index); })
		.duration(600)
		.on('end', appendMemberLabel);

	d3.selectAll('.define-yourself-links-node-line')
		.transition()		
		.attr('x1', function(d) { return d.start[0]; })
		.attr('y1', function(d) { return d.start[1]; })
		.attr('x2', function(d) { return d.end[0]; })
		.attr('y2', function(d) { return d.end[1]; })
		.delay(function(d) { return 1000 + (300 * d.index); })
		.duration(600);
}

function setMembersNodes() {
	let vertices,
		data = [],
		position;

	let members = d3.select('.define-yourself-members');

	members.selectAll('.define-yourself-members-node')
		.data(membersDataSet)
		.enter()
		.append('g')
		.attr('class', 'define-yourself-members-node')		
		.on('mouseover', eventHandlers.handleMouseOverMember)
		.on('mouseleave', eventHandlers.resetToDefault.bind(this, colorsArray, allIdentityKeys))
		.attr('transform', function(d) { return 'translate(' + d.position[0] + ', ' + d.position[1] +')'})
		.append('circle')
		.attr('class', 'define-yourself-members-node-circle')
		.attr('r', 0);
}

function appendMemberLabel(d, i) {
	const member = d3.select(this.parentNode);
	let bbox;

	member.append('g')
		.attr('class', 'define-yourself-members-node-label')
		.append('rect');

	const text = member.select('.define-yourself-members-node-label')
		.append('text')
		.text(d.member);

	bbox = text.node().getBBox();

	member.select('rect')
		.attr('width', bbox.width + 40)
		.attr('height', bbox.height + 10)
		.attr('x', bbox.x - 20)
		.attr('y', bbox.y - 5)
}

function setIdentitiesDataSet() {
	let angle, x, y;
	identitiesDataSet = allIdentityKeys.map((el, i) => {
		angle = (i / (allIdentityKeys.length/2)) * Math.PI;
		x = outerR*0.8 * Math.cos(angle) + outerR;
		y = outerR*0.8 * Math.sin(angle) + outerR;

		identityPosLookup[el] = [x, y];

		return {
				identity: el,
				i: i,
				angle: angle,
				x: x,
				y: y,
				members: parsedData.connections[el] || []
			}
	});
}

function setMemberDataSet() {
	let vertices;
	let pos;
	membersDataSet = parsedData.rows.map((row, i) => {
		/*
		 * option 1
		*/
		// vertices = [];
		// row['define-yourself'].forEach((identity) => {
		// 	vertices.push(identityPosLookup[identity]);
		// })
		// vertices.push([outerR, outerR]);
		// pos = getCentroid(vertices);

		/*
		 * option 2
		*/
		let angle = (i / (parsedData.rows.length/2)) * Math.PI;
		pos = [
			outerR*0.45 * Math.cos(angle) + outerR,
			outerR*0.45 * Math.sin(angle) + outerR
		]

		memberPosLookup[row['Name']] = pos;
		allMemberKeys.push(row['Name']);

		return {
			position: pos,
			member: row['Name'],
			index: i
		}
	})
}

function setLinks() {
	let links = d3.select('.define-yourself-links')
		.selectAll('.define-yourself-links-node')
		.data(identitiesDataSet)
		.enter()
		.append('g')
		.attr('class', 'define-yourself-links-node');

	links.selectAll('define-yourself-links-node-line')
		.data(getLinkData)
		.enter()
		.append('line')
		.attr('class', 'define-yourself-links-node-line')
		.style('stroke', function(d) { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.attr('x1', function(d) { return d.start[0]; })
		.attr('y1', function(d) { return d.start[1]; })
		.attr('x2', function(d) { return d.start[0]; })
		.attr('y2', function(d) { return d.start[1]; });
}

function getLinkData(d) {
	return parsedData.connections['define-yourself'][d.identity].map((member, i) => {
		return {
			end: memberPosLookup[member],
			start: identityPosLookup[d.identity],
			identity: d.identity,
			member: member,
			index: allMemberKeys.indexOf(member)
		}
	})
}

export default {init}