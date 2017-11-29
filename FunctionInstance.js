class FunctionInstance {
    constructor(type, locals, code) {
        this.type = type;
        this.locals = locals;
        this.code = code;
    }
}

module.exports = FunctionInstance;
