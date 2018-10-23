import * as d3 from 'd3';
import './main.scss';

import {dataParser} from 'utility/dataParser';
import defineYourself from 'components/define-yourself/defineYourself';
import vocationAdvocation from 'components/vocation-advocation/vocationAdvocation';
import base from 'base/base';

d3.select('#root')
  .append('svg')
  .attr('id', 'viz');

d3.csv('./dist/data/survey.csv').then((data) => {
	dataParser.setParsedData(data);

	base.init();
	//defineYourself.init();
	vocationAdvocation.init();

	document.getElementById('app-navigation').onclick = () => {
		switch (document.getElementById('viz').getAttribute('data-view')) {
			// case 'define-yourself': 
			// 	vocationAdvocation.init();
			// 	break;
			case 'vocation-advocation':
				defineYourself.init();
				break;
			default:
				break;
		}
	}
})