export const connectionKeys = [
	"vurv-identity",
	"vurv-start",
	"chip",
	"define-yourself",
	"vocation-background",
	"vocation-other",
	"vurv-projects",
	"vurv-collaboration",
	"non-vurv-projects",
	"non-vurv-collaboration"
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
				if (['define-yourself','vocation-background'].indexOf(key) > -1) {
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
	}
}

export default {connectionKeys, dataParser, parsedData}