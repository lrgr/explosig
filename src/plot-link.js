import * as d3 from 'd3';

// Register dispatch events
export const dispatch = d3.dispatch(
    "link-donor", 
    "link-donor-destroy",
    "link-genome", 
    "link-genome-destroy", 
    "link-signature",
    "link-signature-destroy",
    "link-project",
    "link-project-destroy"
);