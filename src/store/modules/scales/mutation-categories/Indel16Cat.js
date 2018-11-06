import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

const INDEL_Alexandrov2018_16_CATEGORIES = [
    'D1C',
    'D1T',
    'I1C',
    'I1T',
    'DR2',
    'DR3',
    'DR4',
    'DR5+',
    'IR2',
    'IR3',
    'IR4',
    'IR5+',
    'DM2',
    'DM3',
    'DM4',
    'DM5+'
];

export default class Indel16Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'INDEL_Alexandrov2018_16';
    }
    
    get name() {
        return 'INDEL 16';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.INDEL;
    }

    get domain() {
        return INDEL_Alexandrov2018_16_CATEGORIES;
    }

}