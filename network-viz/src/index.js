import * as d3 from 'd3';
import './main.scss';

import {dataParser} from 'utility/dataParser';
import defineYourself from 'components/define-yourself/defineYourself';
import vocationAdvocation from 'components/vocation-advocation/vocationAdvocation';

let isInitialized = {
	'define-yourself': false,
	'vocation-advocation': false
}

d3.csv('./../data/survey.csv').then((data) => {
	dataParser.setParsedData(data);

	initializeSections();

	defineYourself.setup();

	window.addEventListener('scroll', (e) => {
		initializeSections();
	});
})

function initializeSections() {	
	Object.keys(isInitialized).forEach((section) => {
		if (!isInitialized[section]) {
			if (isInViewport(document.getElementById(section))) {
				isInitialized[section] = true;
				switch(section) {
					case 'define-yourself':
						defineYourself.init();
						break;
					case 'vocation-advocation':
						vocationAdvocation.init();
						break;
					default:
						break;
				}
			}
		}
	})
}

function isInViewport (elem) {
	const bounding = elem.getBoundingClientRect();
	return (
		bounding.top >= 0 &&
		bounding.bottom <= (window.innerHeight+5 || document.documentElement.clientHeight+5)
	);
}