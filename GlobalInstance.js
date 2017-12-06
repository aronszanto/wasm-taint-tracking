class GlobalInstance {
    constructor(type, value, mutable = true, taint = {}) {
    	this.type = type;
        this.value = value;
        this.mutable = mutable;
        this.taint = taint;
    }
}

module.exports = GlobalInstance;
