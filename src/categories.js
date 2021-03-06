/*
The following objects map mutation super-categories to colors.
*/
export const SBS_SUPERCAT_COLORS = {
    'C>A': '#21BDEC',
    'C>G': '#000000',
    'C>T': '#E02C2E',
    'T>A': '#999999',
    'T>C': '#A2CD69',
    'T>G': '#EAC6C5',
};

export const DBS_SUPERCAT_COLORS = {
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
};

export const INDEL_SUPERCAT_COLORS = {
    'DEL_C_1': '#FCBD75',
    'DEL_T_1': '#FD8024',
    'INS_C_1': '#B1DC8F',
    'INS_T_1': '#3BA036',
    'DEL_repeats_2': '#FCCAB7',
    'DEL_repeats_3': '#FA8A6E',
    'DEL_repeats_4': '#EE463A',
    'DEL_repeats_5+': '#BA1822',
    'INS_repeats_2': '#D1E1F1',
    'INS_repeats_3': '#96C4DE',
    'INS_repeats_4': '#4E99C7',
    'INS_repeats_5+': '#1D66A9',
    'DEL_MH_2': '#E2E2EF',
    'DEL_MH_3': '#B6B7D7',
    'DEL_MH_4': '#8684BB',
    'DEL_MH_5+': '#614399'
};

/*
The following objects map mutation categories to supercategories.
*/
export const SBS_SUPERCAT_MAP = {
    'A[C>A]A': 'C>A', 
    'A[C>A]C': 'C>A', 
    'A[C>A]G': 'C>A', 
    'A[C>A]T': 'C>A', 
    'C[C>A]A': 'C>A',
    'C[C>A]C': 'C>A',
    'C[C>A]G': 'C>A',
    'C[C>A]T': 'C>A',
    'G[C>A]A': 'C>A',
    'G[C>A]C': 'C>A',
    'G[C>A]G': 'C>A',
    'G[C>A]T': 'C>A',
    'T[C>A]A': 'C>A',
    'T[C>A]C': 'C>A',
    'T[C>A]G': 'C>A',
    'T[C>A]T': 'C>A',

    'A[C>G]A': 'C>G', 
    'A[C>G]C': 'C>G', 
    'A[C>G]G': 'C>G', 
    'A[C>G]T': 'C>G', 
    'C[C>G]A': 'C>G', 
    'C[C>G]C': 'C>G', 
    'C[C>G]G': 'C>G', 
    'C[C>G]T': 'C>G', 
    'G[C>G]A': 'C>G', 
    'G[C>G]C': 'C>G', 
    'G[C>G]G': 'C>G', 
    'G[C>G]T': 'C>G', 
    'T[C>G]A': 'C>G', 
    'T[C>G]C': 'C>G', 
    'T[C>G]G': 'C>G', 
    'T[C>G]T': 'C>G', 

    'A[C>T]A': 'C>T', 
    'A[C>T]C': 'C>T',
    'A[C>T]G': 'C>T',
    'A[C>T]T': 'C>T',
    'C[C>T]A': 'C>T',
    'C[C>T]C': 'C>T',
    'C[C>T]G': 'C>T',
    'C[C>T]T': 'C>T',
    'G[C>T]A': 'C>T', 
    'G[C>T]C': 'C>T', 
    'G[C>T]G': 'C>T', 
    'G[C>T]T': 'C>T',
    'T[C>T]A': 'C>T',
    'T[C>T]C': 'C>T',
    'T[C>T]G': 'C>T',
    'T[C>T]T': 'C>T',

    'A[T>A]A': 'T>A',
    'A[T>A]C': 'T>A',
    'A[T>A]G': 'T>A',
    'A[T>A]T': 'T>A',
    'C[T>A]A': 'T>A',
    'C[T>A]C': 'T>A',
    'C[T>A]G': 'T>A',
    'C[T>A]T': 'T>A',
    'G[T>A]A': 'T>A',
    'G[T>A]C': 'T>A',
    'G[T>A]G': 'T>A',
    'G[T>A]T': 'T>A', 
    'T[T>A]A': 'T>A', 
    'T[T>A]C': 'T>A',
    'T[T>A]G': 'T>A',
    'T[T>A]T': 'T>A',

    'A[T>C]A': 'T>C',
    'A[T>C]C': 'T>C',
    'A[T>C]G': 'T>C',
    'A[T>C]T': 'T>C',
    'C[T>C]A': 'T>C',
    'C[T>C]C': 'T>C',
    'C[T>C]G': 'T>C', 
    'C[T>C]T': 'T>C', 
    'G[T>C]A': 'T>C', 
    'G[T>C]C': 'T>C',
    'G[T>C]G': 'T>C', 
    'G[T>C]T': 'T>C',
    'T[T>C]A': 'T>C',
    'T[T>C]C': 'T>C',
    'T[T>C]G': 'T>C', 
    'T[T>C]T': 'T>C',

    'A[T>G]A': 'T>G',
    'A[T>G]C': 'T>G',
    'A[T>G]G': 'T>G',
    'A[T>G]T': 'T>G',
    'C[T>G]A': 'T>G',
    'C[T>G]C': 'T>G',
    'C[T>G]G': 'T>G',
    'C[T>G]T': 'T>G',
    'G[T>G]A': 'T>G',
    'G[T>G]C': 'T>G',
    'G[T>G]G': 'T>G',
    'G[T>G]T': 'T>G',
    'T[T>G]A': 'T>G',
    'T[T>G]C': 'T>G',
    'T[T>G]G': 'T>G',
    'T[T>G]T': 'T>G'
};


export const DBS_SUPERCAT_MAP = {
    'CG>TT': 'CG>NN', 
    'CG>GT': 'CG>NN', 
    'CG>GC': 'CG>NN', 
    'CG>TA': 'CG>NN', 
    'CG>AT': 'CG>NN', 
    'CG>TC': 'CG>NN', 

    'TG>CA': 'TG>NN', 
    'TG>CT': 'TG>NN', 
    'TG>AA': 'TG>NN', 
    'TG>GA': 'TG>NN', 
    'TG>GT': 'TG>NN', 
    'TG>CC': 'TG>NN', 
    'TG>GC': 'TG>NN', 
    'TG>AT': 'TG>NN', 
    'TG>AC': 'TG>NN', 

    'CT>TG': 'CT>NN', 
    'CT>AA': 'CT>NN', 
    'CT>GA': 'CT>NN', 
    'CT>GC': 'CT>NN', 
    'CT>GG': 'CT>NN', 
    'CT>TA': 'CT>NN', 
    'CT>AG': 'CT>NN', 
    'CT>AC': 'CT>NN', 
    'CT>TC': 'CT>NN', 

    'TT>CG': 'TT>NN', 
    'TT>CA': 'TT>NN', 
    'TT>AA': 'TT>NN', 
    'TT>GA': 'TT>NN', 
    'TT>CC': 'TT>NN', 
    'TT>GC': 'TT>NN', 
    'TT>GG': 'TT>NN', 
    'TT>AG': 'TT>NN', 
    'TT>AC': 'TT>NN', 

    'CC>TG': 'CC>NN', 
    'CC>AA': 'CC>NN', 
    'CC>TT': 'CC>NN', 
    'CC>GA': 'CC>NN', 
    'CC>GT': 'CC>NN', 
    'CC>GG': 'CC>NN', 
    'CC>TA': 'CC>NN', 
    'CC>AG': 'CC>NN', 
    'CC>AT': 'CC>NN', 

    'GC>CG': 'GC>NN', 
    'GC>CA': 'GC>NN', 
    'GC>AA': 'GC>NN', 
    'GC>TA': 'GC>NN', 
    'GC>AG': 'GC>NN', 
    'GC>AT': 'GC>NN', 

    'TA>CG': 'TA>NN', 
    'TA>CT': 'TA>NN', 
    'TA>GT': 'TA>NN', 
    'TA>GG': 'TA>NN', 
    'TA>GC': 'TA>NN', 
    'TA>AT': 'TA>NN', 

    'AT>CG': 'AT>NN', 
    'AT>CA': 'AT>NN', 
    'AT>GA': 'AT>NN', 
    'AT>GC': 'AT>NN', 
    'AT>CC': 'AT>NN', 
    'AT>TA': 'AT>NN', 

    'AC>CG': 'AC>NN', 
    'AC>CA': 'AC>NN', 
    'AC>TG': 'AC>NN', 
    'AC>CT': 'AC>NN', 
    'AC>GA': 'AC>NN', 
    'AC>TT': 'AC>NN', 
    'AC>GT': 'AC>NN', 
    'AC>GG': 'AC>NN', 
    'AC>TA': 'AC>NN', 

    'TC>CG': 'TC>NN', 
    'TC>CA': 'TC>NN', 
    'TC>CT': 'TC>NN', 
    'TC>AA': 'TC>NN', 
    'TC>GA': 'TC>NN', 
    'TC>GT': 'TC>NN', 
    'TC>GG': 'TC>NN', 
    'TC>AG': 'TC>NN', 
    'TC>AT': 'TC>NN'
};

export const INDEL_SUPERCAT_MAP = {
    'INS_C_1_0': 'INS_C_1', 
    'INS_C_1_1': 'INS_C_1', 
    'INS_C_1_2': 'INS_C_1', 
    'INS_C_1_3': 'INS_C_1', 
    'INS_C_1_4': 'INS_C_1', 
    'INS_C_1_5+': 'INS_C_1', 

    'INS_T_1_0': 'INS_T_1', 
    'INS_T_1_1': 'INS_T_1', 
    'INS_T_1_2': 'INS_T_1', 
    'INS_T_1_3': 'INS_T_1', 
    'INS_T_1_4': 'INS_T_1', 
    'INS_T_1_5+': 'INS_T_1', 

    'INS_repeats_2_0': 'INS_repeats_2', 
    'INS_repeats_2_1': 'INS_repeats_2', 
    'INS_repeats_2_2': 'INS_repeats_2', 
    'INS_repeats_2_3': 'INS_repeats_2', 
    'INS_repeats_2_4': 'INS_repeats_2', 
    'INS_repeats_2_5+': 'INS_repeats_2', 

    'INS_repeats_3_0': 'INS_repeats_3', 
    'INS_repeats_3_1': 'INS_repeats_3', 
    'INS_repeats_3_2': 'INS_repeats_3', 
    'INS_repeats_3_3': 'INS_repeats_3', 
    'INS_repeats_3_4': 'INS_repeats_3', 
    'INS_repeats_3_5+': 'INS_repeats_3', 

    'INS_repeats_4_0': 'INS_repeats_4', 
    'INS_repeats_4_1': 'INS_repeats_4', 
    'INS_repeats_4_2': 'INS_repeats_4', 
    'INS_repeats_4_3': 'INS_repeats_4', 
    'INS_repeats_4_4': 'INS_repeats_4', 
    'INS_repeats_4_5+': 'INS_repeats_4', 

    'INS_repeats_5+_0': 'INS_repeats_5+', 
    'INS_repeats_5+_1': 'INS_repeats_5+', 
    'INS_repeats_5+_2': 'INS_repeats_5+', 
    'INS_repeats_5+_3': 'INS_repeats_5+', 
    'INS_repeats_5+_4': 'INS_repeats_5+', 
    'INS_repeats_5+_5+': 'INS_repeats_5+', 

    'DEL_C_1_0': 'DEL_C_1', 
    'DEL_C_1_1': 'DEL_C_1', 
    'DEL_C_1_2': 'DEL_C_1', 
    'DEL_C_1_3': 'DEL_C_1', 
    'DEL_C_1_4': 'DEL_C_1', 
    'DEL_C_1_5+': 'DEL_C_1', 

    'DEL_T_1_0': 'DEL_T_1', 
    'DEL_T_1_1': 'DEL_T_1', 
    'DEL_T_1_2': 'DEL_T_1', 
    'DEL_T_1_3': 'DEL_T_1', 
    'DEL_T_1_4': 'DEL_T_1', 
    'DEL_T_1_5+': 'DEL_T_1', 

    'DEL_repeats_2_0': 'DEL_repeats_2', 
    'DEL_repeats_2_1': 'DEL_repeats_2', 
    'DEL_repeats_2_2': 'DEL_repeats_2', 
    'DEL_repeats_2_3': 'DEL_repeats_2', 
    'DEL_repeats_2_4': 'DEL_repeats_2', 
    'DEL_repeats_2_5+': 'DEL_repeats_2', 

    'DEL_repeats_3_0': 'DEL_repeats_3', 
    'DEL_repeats_3_1': 'DEL_repeats_3', 
    'DEL_repeats_3_2': 'DEL_repeats_3', 
    'DEL_repeats_3_3': 'DEL_repeats_3', 
    'DEL_repeats_3_4': 'DEL_repeats_3', 
    'DEL_repeats_3_5+': 'DEL_repeats_3', 

    'DEL_repeats_4_0': 'DEL_repeats_4', 
    'DEL_repeats_4_1': 'DEL_repeats_4', 
    'DEL_repeats_4_2': 'DEL_repeats_4', 
    'DEL_repeats_4_3': 'DEL_repeats_4', 
    'DEL_repeats_4_4': 'DEL_repeats_4', 
    'DEL_repeats_4_5+': 'DEL_repeats_4', 

    'DEL_repeats_5+_0': 'DEL_repeats_5+', 
    'DEL_repeats_5+_1': 'DEL_repeats_5+', 
    'DEL_repeats_5+_2': 'DEL_repeats_5+', 
    'DEL_repeats_5+_3': 'DEL_repeats_5+', 
    'DEL_repeats_5+_4': 'DEL_repeats_5+', 
    'DEL_repeats_5+_5+': 'DEL_repeats_5+', 

    'DEL_MH_2_1': 'DEL_MH_2', 

    'DEL_MH_3_1': 'DEL_MH_3', 
    'DEL_MH_3_2': 'DEL_MH_3', 

    'DEL_MH_4_1': 'DEL_MH_4', 
    'DEL_MH_4_2': 'DEL_MH_4', 
    'DEL_MH_4_3': 'DEL_MH_4', 

    'DEL_MH_5+_1': 'DEL_MH_5+', 
    'DEL_MH_5+_2': 'DEL_MH_5+', 
    'DEL_MH_5+_3': 'DEL_MH_5+', 
    'DEL_MH_5+_4': 'DEL_MH_5+', 
    'DEL_MH_5+_5+': 'DEL_MH_5+'
};

/*
The following arrays order mutation categories.
*/
export const SBS_CATS = [
    'A[C>A]A', 
    'A[C>A]C',
    'A[C>A]G', 
    'A[C>A]T', 
    'C[C>A]A',
    'C[C>A]C',
    'C[C>A]G',
    'C[C>A]T',
    'G[C>A]A',
    'G[C>A]C',
    'G[C>A]G',
    'G[C>A]T',
    'T[C>A]A',
    'T[C>A]C',
    'T[C>A]G',
    'T[C>A]T',

    'A[C>G]A', 
    'A[C>G]C', 
    'A[C>G]G', 
    'A[C>G]T', 
    'C[C>G]A', 
    'C[C>G]C', 
    'C[C>G]G', 
    'C[C>G]T', 
    'G[C>G]A', 
    'G[C>G]C', 
    'G[C>G]G', 
    'G[C>G]T', 
    'T[C>G]A', 
    'T[C>G]C', 
    'T[C>G]G', 
    'T[C>G]T', 

    'A[C>T]A', 
    'A[C>T]C',
    'A[C>T]G',
    'A[C>T]T',
    'C[C>T]A',
    'C[C>T]C',
    'C[C>T]G',
    'C[C>T]T',
    'G[C>T]A', 
    'G[C>T]C', 
    'G[C>T]G', 
    'G[C>T]T',
    'T[C>T]A',
    'T[C>T]C',
    'T[C>T]G',
    'T[C>T]T',

    'A[T>A]A',
    'A[T>A]C',
    'A[T>A]G',
    'A[T>A]T',
    'C[T>A]A',
    'C[T>A]C',
    'C[T>A]G',
    'C[T>A]T',
    'G[T>A]A',
    'G[T>A]C',
    'G[T>A]G',
    'G[T>A]T', 
    'T[T>A]A', 
    'T[T>A]C',
    'T[T>A]G',
    'T[T>A]T',

    'A[T>C]A',
    'A[T>C]C',
    'A[T>C]G',
    'A[T>C]T',
    'C[T>C]A',
    'C[T>C]C',
    'C[T>C]G', 
    'C[T>C]T', 
    'G[T>C]A', 
    'G[T>C]C',
    'G[T>C]G', 
    'G[T>C]T',
    'T[T>C]A',
    'T[T>C]C',
    'T[T>C]G', 
    'T[T>C]T',

    'A[T>G]A',
    'A[T>G]C',
    'A[T>G]G',
    'A[T>G]T',
    'C[T>G]A',
    'C[T>G]C',
    'C[T>G]G',
    'C[T>G]T',
    'G[T>G]A',
    'G[T>G]C',
    'G[T>G]G',
    'G[T>G]T',
    'T[T>G]A',
    'T[T>G]C',
    'T[T>G]G',
    'T[T>G]T'
];

export const DBS_CATS = [
    'AC>CA', 
    'AC>CG', 
    'AC>CT', 
    'AC>GA', 
    'AC>GG', 
    'AC>GT', 
    'AC>TA', 
    'AC>TG', 
    'AC>TT', 
    
    'AT>CA', 
    'AT>CC', 
    'AT>CG', 
    'AT>GA', 
    'AT>GC', 
    'AT>TA',

    'CC>AA', 
    'CC>AG', 
    'CC>AT', 
    'CC>GA', 
    'CC>GG', 
    'CC>GT', 
    'CC>TA', 
    'CC>TG', 
    'CC>TT', 
    
    'CG>AT', 
    'CG>GC', 
    'CG>GT', 
    'CG>TA', 
    'CG>TC', 
    'CG>TT', 

    'CT>AA',
    'CT>AC', 
    'CT>AG', 
    'CT>GA', 
    'CT>GC', 
    'CT>GG', 
    'CT>TA', 
    'CT>TC', 
    'CT>TG', 
     
    'GC>AA', 
    'GC>AG', 
    'GC>AT', 
    'GC>CA', 
    'GC>CG', 
    'GC>TA', 

    'TA>AT', 
    'TA>CG', 
    'TA>CT', 
    'TA>GC', 
    'TA>GG', 
    'TA>GT', 

    'TC>AA', 
    'TC>AG', 
    'TC>AT',
    'TC>CA', 
    'TC>CG', 
    'TC>CT', 
    'TC>GA', 
    'TC>GG', 
    'TC>GT', 
    
    'TG>AA', 
    'TG>AC', 
    'TG>AT', 
    'TG>CA', 
    'TG>CC', 
    'TG>CT', 
    'TG>GA', 
    'TG>GC', 
    'TG>GT', 
    
    'TT>AA', 
    'TT>AC', 
    'TT>AG', 
    'TT>CA', 
    'TT>CC', 
    'TT>CG', 
    'TT>GA', 
    'TT>GC', 
    'TT>GG'
];

export const INDEL_CATS = [
    'DEL_C_1_0', 
    'DEL_C_1_1', 
    'DEL_C_1_2', 
    'DEL_C_1_3', 
    'DEL_C_1_4', 
    'DEL_C_1_5+', 

    'DEL_T_1_0', 
    'DEL_T_1_1', 
    'DEL_T_1_2', 
    'DEL_T_1_3', 
    'DEL_T_1_4', 
    'DEL_T_1_5+', 

    'INS_C_1_0', 
    'INS_C_1_1', 
    'INS_C_1_2', 
    'INS_C_1_3', 
    'INS_C_1_4', 
    'INS_C_1_5+', 

    'INS_T_1_0', 
    'INS_T_1_1', 
    'INS_T_1_2', 
    'INS_T_1_3', 
    'INS_T_1_4', 
    'INS_T_1_5+', 

    'DEL_repeats_2_0', 
    'DEL_repeats_2_1', 
    'DEL_repeats_2_2', 
    'DEL_repeats_2_3', 
    'DEL_repeats_2_4', 
    'DEL_repeats_2_5+', 

    'DEL_repeats_3_0', 
    'DEL_repeats_3_1', 
    'DEL_repeats_3_2', 
    'DEL_repeats_3_3', 
    'DEL_repeats_3_4', 
    'DEL_repeats_3_5+', 

    'DEL_repeats_4_0', 
    'DEL_repeats_4_1', 
    'DEL_repeats_4_2', 
    'DEL_repeats_4_3', 
    'DEL_repeats_4_4', 
    'DEL_repeats_4_5+', 

    'DEL_repeats_5+_0', 
    'DEL_repeats_5+_1', 
    'DEL_repeats_5+_2', 
    'DEL_repeats_5+_3', 
    'DEL_repeats_5+_4', 
    'DEL_repeats_5+_5+', 

    'INS_repeats_2_0', 
    'INS_repeats_2_1', 
    'INS_repeats_2_2', 
    'INS_repeats_2_3', 
    'INS_repeats_2_4', 
    'INS_repeats_2_5+', 

    'INS_repeats_3_0', 
    'INS_repeats_3_1', 
    'INS_repeats_3_2', 
    'INS_repeats_3_3', 
    'INS_repeats_3_4', 
    'INS_repeats_3_5+', 

    'INS_repeats_4_0', 
    'INS_repeats_4_1', 
    'INS_repeats_4_2', 
    'INS_repeats_4_3', 
    'INS_repeats_4_4', 
    'INS_repeats_4_5+', 

    'INS_repeats_5+_0', 
    'INS_repeats_5+_1', 
    'INS_repeats_5+_2', 
    'INS_repeats_5+_3', 
    'INS_repeats_5+_4', 
    'INS_repeats_5+_5+', 

    'DEL_MH_2_1', 

    'DEL_MH_3_1', 
    'DEL_MH_3_2', 

    'DEL_MH_4_1', 
    'DEL_MH_4_2', 
    'DEL_MH_4_3', 

    'DEL_MH_5+_1', 
    'DEL_MH_5+_2', 
    'DEL_MH_5+_3', 
    'DEL_MH_5+_4', 
    'DEL_MH_5+_5+'
];

/**
 * Get the categories that map to supercategories.
 * @param {array} cats Ordering of mutation categories.
 * @param {object} supercatMap Mapping of categories to supercategories.
 * @param {object} supercatColors Mapping of supercategories to colors.
 * @returns {array} Array of supercategory objects containing arrays of categories.
 */
export const getSuperCategoryDetails = function(cats, supercatMap, supercatColors) {
    let result = [];
    for(let cat of cats) {
        let supercat = supercatMap[cat];
        let supercatObj = result.find(el => el["supercategory"] === supercat);
        if(supercatObj === undefined) {
            // Result is array of these objects:
            supercatObj = {
                "supercategory": supercat,
                "color": supercatColors[supercat],
                "categories": [ cat ]
            };
            result.push(supercatObj);
        } else {
            supercatObj["categories"].push(cat);
        }
    }
    return result;
};

/**
 * Get the mapping of categories to colors.
 * @param {array} cats Ordering of mutation categories.
 * @param {object} supercatMap Mapping of categories to supercategories.
 * @param {object} supercatColors Mapping of supercategories to colors.
 * @returns {object} Object where keys are categories and values are colors.
 */
export const getCategoryColors = function(cats, supercatMap, supercatColors) {
    let result = {};
    for(let cat of cats) {
        let supercat = supercatMap[cat];
        result[cat] = supercatColors[supercat];
    }
    return result;
};