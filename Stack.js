class Stack {
    constructor() {
        this.data = [];
    }

    push(el) {
        this.data.push(el);
    }

    pop() {
        return this.data.pop();
    }

    get(idx) {
        return this.data[idx];
    }
}

module.exports = Stack;
