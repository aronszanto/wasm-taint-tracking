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
}

module.exports = MemoryInstance;
