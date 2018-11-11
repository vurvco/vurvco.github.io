import * as d3 from 'd3';

import {parsedData, dataParser} from 'utility/dataParser';
import {getPositionX, getPositionY} from 'utility/getPosition';
import {getColorArray} from 'utility/getColorArray';

const section = document.getElementById('name-cards');

let identityPosLookup = {};
let allIdentityKeys = [];
let people = [];
let colorsArray =[];

export function init() {
	people = parsedData.rows.sort((a,b) => {return a.Name.localeCompare(b.Name); });

	setIdentityPosLookup();	
	setHtml();

	people.forEach((person) => {
		setIdentifier(person.Name)
	})
}

function setHtml() {
	let html = '';
	people.forEach((person) => {
		html += 
		'<div class="name-card">'
			+ '<svg class="name-card-identifier" data-person="' + person.Name + '"></svg>'
			+ '<h3>'
				+ person.Name + (person['alias'] ? ' • ' + person['alias'] : '')
			+ '</h3>'
			+ '<h4>'
				+ person['vurv-identity']
			+ '</h4>'
			+ getHtmlWebsites(person)
		+ '</div>'
	})

	section.innerHTML = html;
}

function setIdentifier(name) {
	const svg = d3.select('#name-cards svg[data-person="' + name + '"]');
	const personIdentities = parsedData.survey[name]['define-yourself'];

	svg.selectAll('.name-card-identity-node')
		.data([personIdentities])
		.enter().append('g')
		.attr('class', 'name-card-identity-node')		

	svg.selectAll('.name-card-identity-node')
		.append('polygon')
		.attr("points",function(d) { 
			let points = d.map(function(d) {
				const pos = identityPosLookup[d];
				return [pos[0],pos[1]].join(",");
			}).join(" ");
			if (d.length < 3) {
				points += ' 24,24';
			}
			return points;
		})
		.style('fill', 'blue')
}

function getHtmlWebsites(person) {
	const websites = person.website ? person.website.split(';') : [];
	let html = '';

	if (websites.length > 0) {
		html += '<ul class="name-card-websites">'
		websites.forEach((website) => {
			html += '<li><a href="http://' 
				+ website 
				+ '" aria-label="' + person.Name + ' webiste"' 
				+ ' target="_blank">' 
				+ website 
			+ '</a></li>' 
		})
		html += '</ul>'
	}

	return html;
}

function setIdentityPosLookup() {
	let angle, x, y;

	allIdentityKeys = dataParser.getConnectionKeys('define-yourself').reverse();
	colorsArray = getColorArray(allIdentityKeys.length);
	
	allIdentityKeys.forEach((identity, i) => {
		angle = (i / (allIdentityKeys.length/2)) * Math.PI;
		x = getPositionX(24, 0.87, angle);
		y = getPositionY(24, 0.87, angle);

		identityPosLookup[identity] = [x, y, colorsArray[i]];
	});
}

export default {init}