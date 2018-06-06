import * as d3 from 'd3';
import { LegendListBus } from '../../../buses.js';
import ClinicalVariable from './ClinicalVariable.js';

export default class TobaccoCV extends ClinicalVariable {
    
    get id () {
        return "Tobacco Binary";
    }
    
    get name () {
        return "Tobacco User";
    }

    get colorScale () {
        return d3.interpolateGreys;
    }
    
}
