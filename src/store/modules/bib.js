const state = {
    all: [
        {
            code: "alexandrov2013signatures",
            title: "Signatures of mutational processes in human cancer",
            authors: [
                "Alexandrov, Ludmil B", 
                "Nik-Zainal, Serena",
                "Wedge, David C",
                "Aparicio, Samuel AJR",
                "Behjati, Sam",
                "Biankin, Andrew V",
                "Bignell, Graham R",
                "Bolli, Niccolo",
                "Borg, Ake",
                "Borresen-Dale, Anne-Lise",
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
                "Helleday, Thomas", 
                "Eshtad, Saeed", 
                "Nik-Zainal, Serena"
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
                "Alexandrov, Ludmil B",
                "Nik-Zainal, Serena", 
                "Wedge, David C", 
                "Campbell, Peter J", 
                "Stratton, Michael R"
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
                "Zou, Xueqing", 
                "Owusu, Michel", 
                "Harris, Rebecca", 
                "Jackson, Stephen P", 
                "Loizou, Joanna I", 
                "Nik-Zainal, Serena"
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
                "Nik-Zainal, Serena", 
                "Kucab, Jill E",
                "Morganella, Sandro",
                "Glodzik, Dominik",
                "Alexandrov, Ludmil B",
                "Arlt, Volker M",
                "Weninger, Annette",
                "Hollstein, Monica", 
                "Stratton, Michael R",
                "Phillips, David H"
            ],
            journal: "Mutagenesis",
            volume: "30",
            number: "6",
            pages: "763-770",
            year: "2015",
            publisher: "Oxford University Press UK"
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