import * as d3 from 'd3';

import {parsedData} from './../../utility/dataParser';

const inactive = 'rgb(80,80,80)';
const svg = d3.select('#define-yourself-svg');

export function resetToDefault(colorsArray, allIdentityKeys, d, i) {
	svg.selectAll('.links-node-line')
		.style('stroke', (d) => { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.style('opacity', 1)

	svg.selectAll('.members-node-circle')
		.style('fill', '')

	svg.selectAll('.identities-node-circle')
		.style('fill', (d,i) => { return colorsArray[i]; })

	svg.selectAll('.members-node-circle')
		.style('fill', '')

	svg.selectAll('.members-node-label')
		.style('display', 'none')
}

export function handleMouseOverIdentity(d, i) {
	const identity = d;

	svg.selectAll('.members-node')
		.filter((d) => { return parsedData.survey[d]['define-yourself'].indexOf(identity) < 0; })
		.select('circle')
		.style('fill', inactive)

	svg.selectAll('.members-node-label')
		.filter((d) => { return parsedData.survey[d]['define-yourself'].indexOf(identity) > -1; })
		.style('display', 'inline')

	highlightLinks(false, identity);
	highlightIdentity(identity);
}

export function handleMouseOverMember(d, i) {
	const thisMember = d;

	svg.selectAll('.identities-node-circle')
		.filter((d) => { return parsedData.survey[thisMember]['define-yourself'].indexOf(d) < 0; })
		.style('fill', inactive)

	highlightLinks(thisMember, false);
	highlightMember(thisMember);
}

function highlightMember(member) {
	svg.selectAll('.members-node-circle')
		.filter((d) => { return d !== member; })
		.style('fill', inactive)

	svg.selectAll('.members-node-label')
		.filter((d) => { return d === member; })		
		.style('display', 'inline')
}

function highlightIdentity (identity) {
	svg.selectAll('.identities-node-circle')
		.filter((d) => { return d !== identity; })
		.style('fill', inactive)
}

function highlightLinks (member, identity) {	
	svg.selectAll('.links-node-line')
		.filter((d) => { 
			return (
				(member ? d.member !== member : true) &&
				(identity ? d.identity !== identity : true)
			)
		})
		.style('stroke', inactive)
		.style('opacity', 0.2)
}

export default {
	handleMouseOverIdentity,
	handleMouseOverMember,
	resetToDefault
}