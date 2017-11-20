export default class {
    constructor(types = [], funcAddrs = [], tableAddrs = [], memAddrs = [], globalAddrs = [], exports = []) {
        this.types = types;
        this.funcAddrs = funcAddrs;
        this.tableAddrs = tableAddrs;
        this.memAddrs = memAddrs;
        this.globalAddrs = globalAddrs;
        this.exports = exports;
    }
}
