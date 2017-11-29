class TableInstance {
    constructor(type, min_size, max_size = undefined, elements = []) {
        this.type = type;
        this.elements = elements;
        this.min_size = min_size;
        this.max_size = max_size;
    }
}

module.exports = TableInstance;
