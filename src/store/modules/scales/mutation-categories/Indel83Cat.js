import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

const INDEL_Alexandrov2018_83_CATEGORIES = [
    'D1C,1', 'D1C,2', 'D1C,3', 'D1C,4', 'D1C,5', 'D1C,6+',
    'D1T,1', 'D1T,2', 'D1T,3', 'D1T,4', 'D1T,5', 'D1T,6+',

    'I1C,0', 'I1C,1', 'I1C,2', 'I1C,3', 'I1C,4', 'I1C,5+',
    'I1T,0', 'I1T,1', 'I1T,2', 'I1T,3', 'I1T,4', 'I1T,5+',

    'DR2,1', 'DR2,2', 'DR2,3', 'DR2,4', 'DR2,5', 'DR2,6+',
    'DR3,1', 'DR3,2', 'DR3,3', 'DR3,4', 'DR3,5', 'DR3,6+',
    'DR4,1', 'DR4,2', 'DR4,3', 'DR4,4', 'DR4,5', 'DR4,6+',
    'DR5+,1', 'DR5+,2', 'DR5+,3', 'DR5+,4', 'DR5+,5', 'DR5+,6+',

    'IR2,0', 'IR2,1', 'IR2,2', 'IR2,3', 'IR2,4', 'IR2,5+',
    'IR3,0', 'IR3,1', 'IR3,2', 'IR3,3', 'IR3,4', 'IR3,5+',
    'IR4,0', 'IR4,1', 'IR4,2', 'IR4,3', 'IR4,4', 'IR4,5+',
    'IR5+,0', 'IR5+,1', 'IR5+,2', 'IR5+,3', 'IR5+,4', 'IR5+,5+',

    'DM2,1',
    'DM3,1', 'DM3,2',
    'DM4,1', 'DM4,2', 'DM4,3',
    'DM5+,1', 'DM5+,2', 'DM5+,3', 'DM5+,4', 'DM5+,5+'
];

export default class Indel83Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'INDEL_Alexandrov2018_83';
    }
    
    get name() {
        return 'INDEL 83';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.INDEL;
    }

    get domain() {
        return INDEL_Alexandrov2018_83_CATEGORIES;
    }

}