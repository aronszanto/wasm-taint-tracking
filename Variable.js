class Variable {
    constructor(type, value = null, taint = {}) {
        this.type = type;
        this.value = value;
        this.taint = taint;
    }

    transfer_taint(variable) {
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] > 0) {
                this.taint[keys[i]] |= variable.taint[keys[i]];
            }
        }
    }

    transfer_direct_taint(variable) {
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] & 1 > 0) {
                this.taint[keys[i]] |= 1;
            }
        }
    }

    transfer_indirect_taint(variable) {
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] & 2 > 0) {
                this.taint[keys[i]] |= 2;
            }
        }
    }
}

module.exports = Variable;
