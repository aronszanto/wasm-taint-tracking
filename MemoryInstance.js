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
        let str = undefined;
        let bytes = ['0', '0', '0', '0'];
        let str_rep;
        for(let i = 1; i < 33; i++) {
            if (i % 4 == 1) {
                if (str != undefined) {
                    console.log(str + '0x' + bytes[0] + bytes[1] + bytes[2] + bytes[3]);
                }
                if (i+3 < 16) {
                    str = "-0x0";
                } else {
                    str = "-0x";
                }
                
                str += (i+3).toString(16) + ": ";
            }
            if (this.bytes[this.bytes.length-i] < 16) {
                str_rep = "0";
            } else {
                str_rep = "";
            }
            str_rep += this.bytes[this.bytes.length-i].toString(16);
            //console.log("A " + this.bytes[this.bytes.length-i]);
            bytes[3 - ((i - 1) % 4)] = str_rep;
        };
    }
}

module.exports = MemoryInstance;
