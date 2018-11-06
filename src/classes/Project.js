export default class Project {

    constructor(id, name, numDonors, source, hasClinical, hasExtended, hasCounts) {
        this.id = id;
        this.name = name;
        this.numDonors = numDonors;
        this.source = source;
        this.hasClinical = hasClinical;
        this.hasExtended = hasExtended;
        this.hasCounts = hasCounts;
    }
    
}