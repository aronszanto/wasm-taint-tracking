class Variable {
    constructor(type, value = null, taint = {}) {
        this.type = type;
        this.value = value;
        this.taint = taint;
    }

    transfer_taint(variable) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] > 0) {
                this.taint[keys[i]] |= variable.taint[keys[i]];
            }
        }
    }

    transfer_direct_taint(variable) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] > 0) {
                //this.taint[keys[i]] |= 1;
                this.taint[keys[i]] |= variable.taint[keys[i]];
            }
        }
    }

    transfer_indirect_taint(variable) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] & 2) {
                this.taint[keys[i]] |= 2;
            }
        }
    }

    transfer_from_taint(taint) {
        if (!taint) {
            return;
        }
        let keys = Object.keys(taint);
        for (let i = 0; i < keys.length; i++) {
            if (taint[keys[i]] > 0) {
                this.taint[keys[i]] |= taint[keys[i]];
            }
        }        
    }

    transfer_from_taint_indirect(variable) {
        if (!taint) {
            return;
        }
        let keys = Object.keys(taint);
        for (let i = 0; i < keys.length; i++) {
            if (taint[keys[i]] & 2) {
                this.taint[keys[i]] |= 2;
            }
        }
    }
}

module.exports = Variable;
