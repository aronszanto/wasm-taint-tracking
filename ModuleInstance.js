class ModuleInstace {
    constructor(types = [], funcAddrs = [], tableAddrs = [], memAddrs = [], globalAddrs = [], exports = []) {
        this.types = types;
        this.funcAddrs = funcAddrs;
        this.tableAddrs = tableAddrs;
        this.memAddrs = memAddrs;
        this.globalAddrs = globalAddrs;
        this.exports = exports;
    }
}

module.exports = ModuleInstace;
