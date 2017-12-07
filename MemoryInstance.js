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
        let string = "";
        for(let i = this.bytes.length-1; i > this.bytes.length-20; i--) {
            string += " " + i + "-" + this.bytes[i];
        };
        console.log(string);
    }
}

module.exports = MemoryInstance;
