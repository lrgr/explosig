// TODO: figure out a better way to do this
export const CONTINUOUS_CLINICAL_VARS = ["Diagnosis Age", "Tobacco Intensity", "Alcohol Intensity"];

export const MUTATION_CATEGORIES_SBS = {'A[C>A]A': 0, 'A[C>A]C': 1, 'A[C>A]G': 2, 'A[C>A]T': 3, 'A[C>G]A': 4, 'A[C>G]C': 5, 'A[C>G]G': 6, 'A[C>G]T': 7, 'A[C>T]A': 8, 'A[C>T]C': 9, 'A[C>T]G': 10, 'A[C>T]T': 11, 'A[T>A]A': 12, 'A[T>A]C': 13, 'A[T>A]G': 14, 'A[T>A]T': 15, 'A[T>C]A': 16, 'A[T>C]C': 17, 'A[T>C]G': 18, 'A[T>C]T': 19, 'A[T>G]A': 20, 'A[T>G]C': 21, 'A[T>G]G': 22, 'A[T>G]T': 23, 'C[C>A]A': 24, 'C[C>A]C': 25, 'C[C>A]G': 26, 'C[C>A]T': 27, 'C[C>G]A': 28, 'C[C>G]C': 29, 'C[C>G]G': 30, 'C[C>G]T': 31, 'C[C>T]A': 32, 'C[C>T]C': 33, 'C[C>T]G': 34, 'C[C>T]T': 35, 'C[T>A]A': 36, 'C[T>A]C': 37, 'C[T>A]G': 38, 'C[T>A]T': 39, 'C[T>C]A': 40, 'C[T>C]C': 41, 'C[T>C]G': 42, 'C[T>C]T': 43, 'C[T>G]A': 44, 'C[T>G]C': 45, 'C[T>G]G': 46, 'C[T>G]T': 47, 'G[C>A]A': 48, 'G[C>A]C': 49, 'G[C>A]G': 50, 'G[C>A]T': 51, 'G[C>G]A': 52, 'G[C>G]C': 53, 'G[C>G]G': 54, 'G[C>G]T': 55, 'G[C>T]A': 56, 'G[C>T]C': 57, 'G[C>T]G': 58, 'G[C>T]T': 59, 'G[T>A]A': 60, 'G[T>A]C': 61, 'G[T>A]G': 62, 'G[T>A]T': 63, 'G[T>C]A': 64, 'G[T>C]C': 65, 'G[T>C]G': 66, 'G[T>C]T': 67, 'G[T>G]A': 68, 'G[T>G]C': 69, 'G[T>G]G': 70, 'G[T>G]T': 71, 'T[C>A]A': 72, 'T[C>A]C': 73, 'T[C>A]G': 74, 'T[C>A]T': 75, 'T[C>G]A': 76, 'T[C>G]C': 77, 'T[C>G]G': 78, 'T[C>G]T': 79, 'T[C>T]A': 80, 'T[C>T]C': 81, 'T[C>T]G': 82, 'T[C>T]T': 83, 'T[T>A]A': 84, 'T[T>A]C': 85, 'T[T>A]G': 86, 'T[T>A]T': 87, 'T[T>C]A': 88, 'T[T>C]C': 89, 'T[T>C]G': 90, 'T[T>C]T': 91, 'T[T>G]A': 92, 'T[T>G]C': 93, 'T[T>G]G': 94, 'T[T>G]T': 95};

export const KARYOTYPE_COLORS = {
    'gneg': '#E3E3E3',
    'gpos25': '#8E8E8E',
    'gpos50': '#555555',
    'gpos75': '#393939',
    'gpos100': '#000000',
    'acen': '#963232',
    'stalk': '#7F7F7F',
    'gvar': '#000000'
};

export const MUTATION_COLORS = {
    'C>A': '#21BDEC',
    'C>G': '#000000',
    'C>T': '#E02C2E',
    'T>A': '#999999',
    'T>C': '#A2CD69',
    'T>G': '#EAC6C5',

    'AC>NN': '#A7CEE2',
    'AT>NN': '#2679B2',
    'CC>NN': '#B3DE8E',
    'CG>NN': '#399F34',
    'CT>NN': '#F99B9B',
    'GC>NN': '#E01F27',
    'TA>NN': '#FCBE75',
    'TC>NN': '#FD7F23',
    'TG>NN': '#CAB3D5',
    'TT>NN': '#694098',

    // TODO: update these
    '1DC': '#FCBD75',
    '1DT': '#FD8024',
    '1IC': '#B1DC8F',
    '1IT': '#3BA036',
    'DR2': '#FCCAB7',
    'DR3': '#FA8A6E',
    'DR4': '#EE463A',
    'DR5+': '#BA1822',
    'IR2': '#D1E1F1',
    'IR3': '#96C4DE',
    'IR4': '#4E99C7',
    'IR5+': '#1D66A9',
    'DM2': '#E2E2EF',
    'DM3': '#B6B7D7',
    'DM4': '#8684BB',
    'DM5+': '#614399'
};