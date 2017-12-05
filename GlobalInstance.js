class GlobalInstance {
    constructor(type, value, mutable = true) {
    	this.type = type;
        this.value = value;
        this.mutable = mutable;
    }
}

module.exports = GlobalInstance;
