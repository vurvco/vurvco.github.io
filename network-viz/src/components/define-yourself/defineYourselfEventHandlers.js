import * as d3 from 'd3';

import {parsedData} from './../../utility/dataParser';

const inactive = 'rgb(80,80,80)';

export function resetToDefault(colorsArray, allIdentityKeys, d, i) {
	d3.selectAll('.links-node-line')
		.style('stroke', (d) => { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.style('opacity', 1)

	d3.selectAll('.members-node-circle')
		.style('fill', '')

	d3.selectAll('.identities-node-circle')
		.style('fill', (d,i) => { return colorsArray[i]; })

	d3.selectAll('.members-node-circle')
		.style('fill', '')

	d3.selectAll('.members-node-label')
		.style('opacity', 0)
}

export function handleMouseOverIdentity(d, i) {
	const identity = d;

	d3.selectAll('.members-node')
		.filter((d) => { return parsedData.survey[d]['define-yourself'].indexOf(identity) < 0; })
		.select('circle')
		.style('fill', inactive)

	d3.selectAll('.members-node-label')
		.filter((d) => { return parsedData.survey[d]['define-yourself'].indexOf(identity) > -1; })
		.style('opacity', 1)

	highlightLinks(false, identity);
	highlightIdentity(identity);
}

export function handleMouseOverMember(d, i) {
	const thisMember = d;

	d3.selectAll('.identities-node-circle')
		.filter((d) => { return parsedData.survey[thisMember]['define-yourself'].indexOf(d) < 0; })
		.style('fill', inactive)

	highlightLinks(thisMember, false);
	highlightMember(thisMember);
}

function highlightMember(member) {
	d3.selectAll('.members-node-circle')
		.filter((d) => { return d !== member; })
		.style('fill', inactive)

	d3.selectAll('.members-node-label')
		.filter((d) => { return d === member; })
		.style('opacity', 1)
}

function highlightIdentity (identity) {
	d3.selectAll('.identities-node-circle')
		.filter((d) => { return d !== identity; })
		.style('fill', inactive)
}

function highlightLinks (member, identity) {	
	d3.selectAll('.links-node-line')
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