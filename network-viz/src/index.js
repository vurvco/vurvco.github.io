import * as d3 from 'd3';
import './main.scss';

import {dataParser} from './utility/dataParser';
import defineYourself from './components/defineYourself';

d3.select('#root')
  .append('svg')
  .attr('id', 'viz');

d3.csv('./data/survey.csv').then((data) => {
	dataParser.setParsedData(data);

	defineYourself.init();
})