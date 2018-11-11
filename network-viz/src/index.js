import * as d3 from 'd3';
import './main.scss';

import {dataParser} from 'utility/dataParser';
import defineYourself from 'components/define-yourself/defineYourself';
import vocationAdvocation from 'components/vocation-advocation/vocationAdvocation';
import intro from 'components/intro/intro';
import nameCards from 'components/name-cards/nameCards';

let isInitialized = {
	'define-yourself': false,
	'vocation-advocation': false,
	'intro': false
}

d3.csv('./../dist/data/survey.csv').then((data) => {
	dataParser.setParsedData(data);

	initializeSections();

	intro.setup();
	defineYourself.setup();
	vocationAdvocation.setup();

	nameCards.init();

	window.addEventListener('scroll', (e) => {
		initializeSections();
	});
})

function initializeSections() {	
	Object.keys(isInitialized).forEach((section) => {
		if (!isInitialized[section]) {
			if (isInViewport(document.getElementById(section))) {
				console.log(section)
				isInitialized[section] = true;
				switch(section) {
					case 'define-yourself':
						defineYourself.init();
						break;
					case 'vocation-advocation':
						vocationAdvocation.init();
						break;
					case 'intro':
						intro.init();
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
		bounding.bottom <= (window.innerHeight+25 || document.documentElement.clientHeight+25)
	);
}