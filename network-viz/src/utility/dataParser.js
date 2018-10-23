export const connectionKeys = [
	"vurv-identity",
	"vurv-start",
	"chip",
	"define-yourself",
	"vocation",
	"vurv-projects",
	"vurv-collaboration",
	"non-vurv-projects",
	"non-vurv-collaboration",
	"advocation",
	"collaborators-wanted"
];

export var parsedData = {
	connections: {},
	survey: {},
	rows: []
}

export const dataParser = {
	setParsedData(data) {
		let survey = {};
		data.forEach((d) => {
			connectionKeys.forEach((key) => {
				if (['define-yourself', 'vocation', 'advocation', 'collaborators-wanted'].indexOf(key) > -1) {
					d[key] = d[key].toLowerCase();
				}
				d[key] = d[key].replace(/;/g, ', ').split(', ');
			})
			survey[d.Name] = d;
		})

		parsedData.survey = survey;
		parsedData.rows = data;

		dataParser.setLinksConnections();
	},
	setLinksConnections() {
		let connections = {};
		let attr;

		connectionKeys.forEach((key) => {
			connections[key] = {};
		});

		parsedData.rows.forEach((d, i) => {
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
		});

		parsedData.connections = connections;
	},
	getConnectionKeys(connectionId) {
		return Object.keys(parsedData.connections[connectionId]).sort() || [];
	},
	getConnections(connectionId) {
		return parsedData.connections[connectionId] || {};
	},
	getMembers() {
		return parsedData.rows.map((el) => { return el.Name; }).sort() || [];
	}
}

export default {dataParser, parsedData}