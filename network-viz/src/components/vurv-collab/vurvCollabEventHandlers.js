import * as d3 from 'd3';

import {parsedData, dataParser} from './../../utility/dataParser';

const inactive = 'rgb(80,80,80)';
const svg = d3.select('#vurv-collab-svg');

export function resetToDefault(colorsArray, memberKeys) {
	svg.selectAll('.links-node-line')
		.style('stroke', (d,i,j) => { return colorsArray[j[i].parentNode.getAttribute('data-index')]; })
		.style('opacity', 1)

	svg.selectAll('.members-node-circle')
		.style('fill', '')

	svg.selectAll('.members-node-label')
		.style('display', 'none')
}

export function handleMouseOverMember(d, i) {
	const thisMember = d.member;

	highlightLinks(thisMember);
	highlightMember(thisMember);
}

function highlightMember(member) {
	const connections = dataParser.getConnections('vurv-collaboration');

	svg.selectAll('.members-node')
		.filter((d) => { 
			let isConnected = false;
			if (parsedData.survey[member]) {
				isConnected = parsedData.survey[member]['vurv-collaboration'].indexOf(d.member) > -1;
			}

			return d.member !== member && (connections[member] || []).indexOf(d.member) === -1 && !isConnected; 
		})
		.selectAll('circle')
		.style('fill', inactive)

	svg.selectAll('.members-node')
		.filter((d) => { return d.member === member; })
		.selectAll('.members-node-label')
		.style('display', 'inline')
}

function highlightLinks (member) {	
	svg.selectAll('.links-node-line:not([data-from="' + member + '"]):not([data-to="' + member + '"])')
		.style('stroke', inactive)
		.style('opacity', 0.2)
}

export default {
	handleMouseOverMember,
	resetToDefault
}