import * as d3 from 'd3';
import './main.scss';

import {dataParser} from 'utility/dataParser';
import defineYourself from 'components/define-yourself/defineYourself';
import vocationAdvocation from 'components/vocation-advocation/vocationAdvocation';
import intro from 'components/intro/intro';
import vurvCollab from 'components/vurv-collab/vurvCollab';
import nameCards from 'components/name-cards/nameCards';

let isInitialized = {
	'define-yourself': false,
	'vocation-advocation': false,
	'intro': false,
	'vurv-collab': false
}

d3.csv('./dist/data/survey.csv').then((data) => {
	dataParser.setParsedData(data);

	initializeSections();

	intro.setup();
	defineYourself.setup();
	vocationAdvocation.setup();
	vurvCollab.setup();

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
					case 'vurv-collab':
						vurvCollab.init();
						break;
					default:
						break;
				}
			}
		}
	})
}

let trigger = 0;
setScrollTriggerPoints();
window.addEventListener('resize', () => {
	setScrollTriggerPoints();
});

// Create an imaginary line at a fixed percent of the screen
// for use when triggering animations
function setScrollTriggerPoints() {
	const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	const triggerScreenPercent = 0.33;
	trigger = Math.floor(viewportHeight * triggerScreenPercent);
}

// If visualization's top is above the trigger line
// and visualization's bottom is below the trigger line
// visualization is "in view" - trigger animation
function isInViewport (elem) {
	const bounding = elem.getBoundingClientRect();
	return (
		bounding.top <= trigger &&
		bounding.bottom >= trigger
	);
}
