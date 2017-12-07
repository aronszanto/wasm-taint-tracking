const page_size = 65536;
class MemoryInstance {
    constructor(limits, bytes = undefined) {
        this.limits = limits;
        if (bytes == undefined) {
            this.bytes = new Uint8Array(limits.min * page_size);
        } else {
            this.bytes = bytes;
        }
        this.taintDict = {};
    }


    receive_taint_variable(variable, idx) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] > 0) {
                this.taintDict[idx][keys[i]] |= variable.taint[keys[i]];
            }
        }
    }

    receive_direct_taint_variable(variable, idx) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] > 0) {
                //this.taint[keys[i]] |= 1;
                this.taintDict[idx][keys[i]] |= variable.taint[keys[i]];
            }
        }
    }

    receive_indirect_taint_variable(variable, idx) {
        if (!variable.taint) {
            return;
        }
        let keys = Object.keys(variable.taint);
        for (let i = 0; i < keys.length; i++) {
            if (variable.taint[keys[i]] & 2) {
                this.taintDict[idx][keys[i]] |= 2;
            }
        }
    }

    getTaint(idx) {
        return this.taintDict[idx];
    }

    taintInit(idx) {
        this.taintDict[idx] = {};
    }

    print() {
        console.log("MEMORY: ");
        let string = "";
        for(let i = this.bytes.length-1; i > this.bytes.length-20; i--) {
            string += " " + i + "-" + this.bytes[i];
        };
        console.log(string);
    }
}

module.exports = MemoryInstance;
