import * as d3 from 'd3';
import './main.scss';

d3.select('#root')
  .append('p')
  .append('text')
  .text(`d3 version: ${d3.version}`)

d3.csv('./data/survey.csv').then((data) => {
	let nodes = getParseData(data);
	let {links, connections} = getLinksConnections(nodes);
	init(nodes, links, connections);
})

function getParseData(data) {
	data.forEach((d) => {
		d['define-yourself'] = d['define-yourself'].toLowerCase().split(', ');
		d['vurv-collaboration'] = d['vurv-collaboration'].split(', ');
		d['non-vurv-collaboration'] = d['non-vurv-collaboration'].split(', ');
	})

	return data;
}

function getLinksConnections(nodes) {
	let links = [];
	let connections = {
		'define-yourself': {},
		'vurv-collaboration': {},
		'non-vurv-collaboration': {}
	};
	let attr;

	nodes.forEach((d, i) => {
		for (attr in connections) {
			d[attr].forEach((key) => {
				if (key.length > 0) {
					if (!connections[attr][key]) {
						connections[attr][key] = [];
					} 
					connections[attr][key].push(d.Name)
				}
			})
		}
	})

	return {links, connections};
}

function init(nodes, links, connections) {

	console.log(nodes, links, connections)
}
