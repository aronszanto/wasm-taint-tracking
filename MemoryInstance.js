const page_size = 65536;
class MemoryInstance {
    constructor(limits, bytes = undefined) {
        this.limits = limits;
        if (bytes == undefined) {
            this.bytes = new Uint8Array(limits.min * page_size);
        } else {
            this.bytes = bytes;
        }
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
            console.log("A " + this.bytes[this.bytes.length-i]);
            bytes[3 - ((i - 1) % 4)] = str_rep;
        };
    }
}

module.exports = MemoryInstance;
