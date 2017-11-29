const Stack = require('./Stack');

class ModuleInstace {
    constructor(funcs = [], tables = [], memories = [], globals = [], exports = [], start = undefined) {
        this.funcs = funcs;
        this.tables = tables;
        this.memories = memories;
        this.globals = globals;
        this.exports = exports;
        this.start = start;
        this.stack = new Stack();
    }
}

module.exports = ModuleInstace;
