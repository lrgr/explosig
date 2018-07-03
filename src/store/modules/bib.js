const state = {
    all: [
        {
            code: "alexandrov2013signatures",
            title: "Signatures of mutational processes in human cancer",
            authors: [
                "L. B. Alexandrov", 
                "S. Nik-Zainal",
                "D. C. Wedge",
                "S. Aparicio",
                "S. Behjati",
                "A. V. Biankin",
                "G. R. Bignell",
                "N. Bolli",
                "A. Borg",
                "A. Borresen-Dale",
                "et al"
            ],
            journal: "Nature",
            volume: "500",
            number: "7463",
            pages: "415",
            year: "2013",
            publisher: "Nature Publishing Group"
        },
        {
            code: "helleday2014mechanisms",
            title: "Mechanisms underlying mutational signatures in human cancers",
            authors: [
                "T. Helleday", 
                "S. Eshtad", 
                "S. Nik-Zainal"
            ],
            journal: "Nature Reviews Genetics",
            volume: "15",
            number: "9",
            pages: "585",
            year: "2014",
            publisher: "Nature Publishing Group"
        },
        {
            code: "alexandrov2013deciphering",
            title: "Deciphering signatures of mutational processes operative in human cancer",
            authors: [
                "L. B. Alexandrov",
                "S. Nik-Zainal", 
                "D. C. Wedge", 
                "P. J. Campbell", 
                "M. R. Stratton"
            ],
            journal: "Cell Reports",
            volume: "3",
            number: "1",
            pages: "246-259",
            year: "2013",
            publisher: "Elsevier"
        },
        {
            code: "zou2018validating",
            title: "Validating the concept of mutational signatures with isogenic cell models",
            authors: [
                "X. Zou", 
                "M. Owusu", 
                "R. Harris", 
                "S. P Jackson", 
                "J. I. Loizou", 
                "S. Nik-Zainal"
            ],
            journal: "Nature Communications",
            volume: "9",
            number: "1",
            pages: "1744",
            year: "2018",
            publisher: "Nature Publishing Group"
        },
        {
            code: "nik2015genome",
            title: "The genome as a record of environmental exposure",
            authors: [
                "S. Nik-Zainal", 
                "J. E. Kucab",
                "S. Morganella",
                "D. Glodzik",
                "L. B. Alexandrov",
                "V. M. Arlt",
                "A. Weninger",
                "M. Hollstein", 
                "M. R. Stratton",
                "D. H. Phillips"
            ],
            journal: "Mutagenesis",
            volume: "30",
            number: "6",
            pages: "763-770",
            year: "2015",
            publisher: "Oxford University Press UK"
        },
        {
            code: "alexandrov2016mutational",
            title: "Mutational signatures associated with tobacco smoking in human cancer",
            authors: [
                "L. B. Alexandrov", 
                "Y. S. Ju",
                "K. Haase",
                "P. Van Loo",
                "I. Martincorena",
                "S. Nik-Zainal",
                "Y.Totoki",
                "A. Fujimoto", 
                "H. Nakagawa",
                "T. Shibata",
                "et al"
            ],
            journal: "Science",
            volume: "354",
            number: "6312",
            pages: "618-622",
            year: "2016",
            publisher: "American Association for the Advancement of Science"
        },
        {
            code: "haradhvala2018distinct",
            title: "Distinct mutational signatures characterize concurrent loss of polymerase proofreading and mismatch repair",
            authors: [
                "N. J. Haradhvala", 
                "J. Kim",
                "Y. E. Maruvka",
                "P. Polak",
                "D. Rosebrock",
                "D. Livitz",
                "J. M. Hess",
                "I. Leshchiner", 
                "A. Kamburov",
                "K. W. Mouw",
                "et al"
            ],
            journal: "Nature Communications",
            volume: "9",
            number: "1",
            pages: "1746",
            year: "2018",
            publisher: "Nature Publishing Group"
        }
    ],
    bib: []
}

const getters = {
    bibliography: state => (state.bib),
    citationNumber: state => (code) => (state.bib.findIndex((el) => (el.code == code)) + 1)
}

const actions = {

}

const mutations = {
    addCitation (state, code) {
        let citation = state.all.find((el) => (el.code == code));
        if(state.bib.findIndex((el) => el.code == code) == -1) {
            state.bib.push(citation);
            // should sort bib here but sorting here seems to mess things up
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}