class Store {
    constructor(func = [], tables = [], mems = [], globals = []) {
        this.funcs = funcs;
        this.tables = tables;
        this.mems = mems;
        this.globals = globals;
    }
}

module.exports = Store;
