import * as d3 from 'd3';
import './main.scss';

d3.select('#root')
  .append('p')
  .append('text')
  .text(`d3 version: ${d3.version}`)

