import * as d3 from 'd3';

// Register dispatch events
export const dispatch = d3.dispatch(
    "link-donor", 
    "link-genome", 
    "link-signature",
    "link-project"
);