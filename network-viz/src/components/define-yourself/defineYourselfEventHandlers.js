import * as d3 from 'd3';

import {parsedData} from './../../utility/dataParser';

const inactive = 'rgb(80,80,80)';

export function handleMouseOverIdentity(d, i) {
	const identity = d.identity;
	d3.selectAll('.define-yourself-links-node-line')
		.filter(function(d) { return d.identity !== identity; })
		.style('stroke', inactive)
		.style('opacity', 0.2)

	d3.selectAll('.define-yourself-identities-node-circle')
		.filter(function(d) { return d.identity !== identity; })
		.style('fill', inactive)

	d3.selectAll('.define-yourself-members-node')
		.filter(function(d) { return parsedData.survey[d.member]['define-yourself'].indexOf(identity) < 0; })
		.select('circle')
		.style('fill', inactive)

	d3.selectAll('.define-yourself-members-node-label')
		.filter(function(d) { return parsedData.survey[d.member]['define-yourself'].indexOf(identity) > -1; })
		.style('opacity', 1)
}

export function resetToDefault(colorsArray, allIdentityKeys, d, i) {
	d3.selectAll('.define-yourself-links-node-line')
		.style('stroke', function(d) { return colorsArray[allIdentityKeys.indexOf(d.identity)]; })
		.style('opacity', 1)

	d3.selectAll('.define-yourself-members-node-circle')
		.style('fill', '')

	d3.selectAll('.define-yourself-identities-node-circle')
		.style('fill', function(d, i) { return colorsArray[i]; })

	d3.selectAll('.define-yourself-members-node-circle')
		.style('fill', '')

	d3.selectAll('.define-yourself-members-node-label')
		.style('opacity', 0)
}

export function handleMouseOverMember(d, i) {
	const member = d.member;
	d3.selectAll('.define-yourself-members-node-circle')
		.filter(function(d) { return d.member !== member; })
		.style('fill', inactive)
	
	d3.selectAll('.define-yourself-links-node-line')
		.filter(function(d) { return d.member !== member; })
		.style('stroke', inactive)
		.style('opacity', 0.2)

	d3.selectAll('.define-yourself-identities-node-circle')
		.filter(function(d) { return parsedData.survey[member]['define-yourself'].indexOf(d.identity) < 0; })
		.style('fill', inactive)

	d3.selectAll('.define-yourself-members-node-label')
		.filter(function(d) { return d.member === member; })
		.style('opacity', 1)
}

export default {handleMouseOverIdentity, handleMouseOverMember, resetToDefault}