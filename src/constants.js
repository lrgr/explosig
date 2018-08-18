export const CHROMOSOMES = [
    '1',
    '2', 
    '3', 
    '4', 
    '5', 
    '6', 
    '7', 
    '8', 
    '9', 
    '10', 
    '11', 
    '12', 
    '13', 
    '14', 
    '15', 
    '16', 
    '17', 
    '18', 
    '19', 
    '20', 
    '21', 
    '22', 
    'X', 
    'Y', 
    'M'
];

const SBS_6_CATEGORY_INDEX = {
    'C>A': 0, 
    'C>G': 1, 
    'C>T': 2, 
    'T>A': 3, 
    'T>C': 4, 
    'T>G': 5
};

const SBS_96_CATEGORY_INDEX = {
    'A[C>A]A': 0, 'A[C>A]C': 1, 'A[C>A]G': 2, 'A[C>A]T': 3, 
    'C[C>A]A': 4, 'C[C>A]C': 5, 'C[C>A]G': 6, 'C[C>A]T': 7, 
    'G[C>A]A': 8, 'G[C>A]C': 9, 'G[C>A]G': 10, 'G[C>A]T': 11, 
    'T[C>A]A': 12, 'T[C>A]C': 13, 'T[C>A]G': 14, 'T[C>A]T': 15, 
    
    'A[C>G]A': 16, 'A[C>G]C': 17, 'A[C>G]G': 18, 'A[C>G]T': 19, 
    'C[C>G]A': 20, 'C[C>G]C': 21, 'C[C>G]G': 22, 'C[C>G]T': 23, 
    'G[C>G]A': 24, 'G[C>G]C': 25, 'G[C>G]G': 26, 'G[C>G]T': 27, 
    'T[C>G]A': 28, 'T[C>G]C': 29, 'T[C>G]G': 30, 'T[C>G]T': 31, 
    
    'A[C>T]A': 32, 'A[C>T]C': 33, 'A[C>T]G': 34, 'A[C>T]T': 35, 
    'C[C>T]A': 36, 'C[C>T]C': 37, 'C[C>T]G': 38, 'C[C>T]T': 39,
    'G[C>T]A': 40, 'G[C>T]C': 41, 'G[C>T]G': 42, 'G[C>T]T': 43, 
    'T[C>T]A': 44, 'T[C>T]C': 45, 'T[C>T]G': 46, 'T[C>T]T': 47,  
    
    'A[T>A]A': 48, 'A[T>A]C': 49, 'A[T>A]G': 50, 'A[T>A]T': 51, 
    'C[T>A]A': 52, 'C[T>A]C': 53, 'C[T>A]G': 54, 'C[T>A]T': 55, 
    'G[T>A]A': 56, 'G[T>A]C': 57, 'G[T>A]G': 58, 'G[T>A]T': 59,
    'T[T>A]A': 60, 'T[T>A]C': 61, 'T[T>A]G': 62, 'T[T>A]T': 63, 
    
    'A[T>C]A': 64, 'A[T>C]C': 65, 'A[T>C]G': 66, 'A[T>C]T': 67, 
    'C[T>C]A': 68, 'C[T>C]C': 69, 'C[T>C]G': 70, 'C[T>C]T': 71, 
    'G[T>C]A': 72, 'G[T>C]C': 73, 'G[T>C]G': 74, 'G[T>C]T': 75, 
    'T[T>C]A': 76, 'T[T>C]C': 77, 'T[T>C]G': 78, 'T[T>C]T': 79, 
    
    'A[T>G]A': 80, 'A[T>G]C': 81, 'A[T>G]G': 82, 'A[T>G]T': 83, 
    'C[T>G]A': 84, 'C[T>G]C': 85, 'C[T>G]G': 86, 'C[T>G]T': 87, 
    'G[T>G]A': 88, 'G[T>G]C': 89, 'G[T>G]G': 90, 'G[T>G]T': 91, 
    'T[T>G]A': 92, 'T[T>G]C': 93, 'T[T>G]G': 94, 'T[T>G]T': 95
};

const DBS_10_CATEGORY_INDEX = {
    'AC>NN': 0,
    'AT>NN': 1,
    'CC>NN': 2,
    'CG>NN': 3,
    'CT>NN': 4,
    'GC>NN': 5,
    'TA>NN': 6,
    'TC>NN': 7,
    'TG>NN': 8,
    'TT>NN': 9
};

const DBS_78_CATEGORY_INDEX = {
    'AC>CA': 0, 
    'AC>CG': 1,
    'AC>CT': 2,
    'AC>GA': 3,
    'AC>GG': 4,
    'AC>GT': 5,
    'AC>TA': 6,
    'AC>TG': 7,
    'AC>TT': 8,
    
    'AT>CA': 9,
    'AT>CC': 10,
    'AT>CG': 11,
    'AT>GA': 12,
    'AT>GC': 13,
    'AT>TA': 14,

    'CC>AA': 15,
    'CC>AG': 16,
    'CC>AT': 17,
    'CC>GA': 18,
    'CC>GG': 19,
    'CC>GT': 20,
    'CC>TA': 21,
    'CC>TG': 22,
    'CC>TT': 23,

    'CG>AT': 24,
    'CG>GC': 25,
    'CG>GT': 26,
    'CG>TA': 27,
    'CG>TC': 28,
    'CG>TT': 29,

    'CT>AA': 30,
    'CT>AC': 31,
    'CT>AG': 32,
    'CT>GA': 33,
    'CT>GC': 34,
    'CT>GG': 35,
    'CT>TA': 36,
    'CT>TC': 37,
    'CT>TG': 38,

    'GC>AA': 39,
    'GC>AG': 40,
    'GC>AT': 41,
    'GC>CA': 42,
    'GC>CG': 43,
    'GC>TA': 44,

    'TA>AT': 45,
    'TA>CG': 46,
    'TA>CT': 47,
    'TA>GC': 48,
    'TA>GG': 49,
    'TA>GT': 50,

    'TC>AA': 51,
    'TC>AG': 52,
    'TC>AT': 53,
    'TC>CA': 54,
    'TC>CG': 55,
    'TC>CT': 56,
    'TC>GA': 57,
    'TC>GG': 58,
    'TC>GT': 59,

    'TG>AA': 60,
    'TG>AC': 61,
    'TG>AT': 62,
    'TG>CA': 63,
    'TG>CC': 64,
    'TG>CT': 65,
    'TG>GA': 66,
    'TG>GC': 67,
    'TG>GT': 68,

    'TT>AA': 69,
    'TT>AC': 70,
    'TT>AG': 71,
    'TT>CA': 72,
    'TT>CC': 73,
    'TT>CG': 74,
    'TT>GA': 75,
    'TT>GC': 76,
    'TT>GG': 77,
};

const INDEL_Alexandrov2018_16_CATEGORY_INDEX = {
    'D1C': 0,
    'D1T': 1,
    'I1C': 2,
    'I1T': 3,
    'DR2': 4,
    'DR3': 5,
    'DR4': 6,
    'DR5+': 7,
    'IR2': 8,
    'IR3': 9,
    'IR4': 10,
    'IR5+': 11,
    'DM2': 12,
    'DM3': 13,
    'DM4': 14,
    'DM5+': 15
};

const INDEL_Alexandrov2018_83_CATEGORY_INDEX = {
    'D1C,1': 0, 'D1C,2': 1, 'D1C,3': 2, 'D1C,4': 3, 'D1C,5': 4, 'D1C,6+': 5,
    'D1T,1': 6, 'D1T,2': 7, 'D1T,3': 8, 'D1T,4': 9, 'D1T,5': 10, 'D1T,6+': 11,

    'I1C,0': 12, 'I1C,1': 13, 'I1C,2': 14, 'I1C,3': 15, 'I1C,4': 16, 'I1C,5+': 17,
    'I1T,0': 18, 'I1T,1': 19, 'I1T,2': 20, 'I1T,3': 21, 'I1T,4': 22, 'I1T,5+': 23,

    'DR2,1': 24, 'DR2,2': 25, 'DR2,3': 26, 'DR2,4': 27, 'DR2,5': 28, 'DR2,6+': 29,
    'DR3,1': 30, 'DR3,2': 31, 'DR3,3': 32, 'DR3,4': 33, 'DR3,5': 34, 'DR3,6+': 35,
    'DR4,1': 36, 'DR4,2': 37, 'DR4,3': 38, 'DR4,4': 39, 'DR4,5': 40, 'DR4,6+': 41,
    'DR5+,1': 42, 'DR5+,2': 43, 'DR5+,3': 44, 'DR5+,4': 45, 'DR5+,5': 46, 'DR5+,6+': 47,

    'IR2,0': 48, 'IR2,1': 49, 'IR2,2': 50, 'IR2,3': 51, 'IR2,4': 52, 'IR2,5+': 53,
    'IR3,0': 54, 'IR3,1': 55, 'IR3,2': 56, 'IR3,3': 57, 'IR3,4': 58, 'IR3,5+': 59,
    'IR4,0': 60, 'IR4,1': 61, 'IR4,2': 62, 'IR4,3': 63, 'IR4,4': 64, 'IR4,5+': 65,
    'IR5+,0': 66, 'IR5+,1': 67, 'IR5+,2': 68, 'IR5+,3': 69, 'IR5+,4': 70, 'IR5+,5+': 71,

    'DM2,1': 72,
    'DM3,1': 73, 'DM3,2': 74,
    'DM4,1': 75, 'DM4,2': 76, 'DM4,3': 77,
    'DM5+,1': 78, 'DM5+,2': 79, 'DM5+,3': 80, 'DM5+,4': 81, 'DM5+,5+': 82
};

export const CATEGORY_INDEX = {
    'SBS_6': SBS_6_CATEGORY_INDEX,
    'SBS_96': SBS_96_CATEGORY_INDEX,

    'DBS_10': DBS_10_CATEGORY_INDEX,
    'DBS_78': DBS_78_CATEGORY_INDEX,

    'INDEL_Alexandrov2018_16': INDEL_Alexandrov2018_16_CATEGORY_INDEX,
    'INDEL_Alexandrov2018_83': INDEL_Alexandrov2018_83_CATEGORY_INDEX
}
