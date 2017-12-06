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

    set(idx, val) {
        this.data[idx] = val;
    }

    len() {
        return this.data.length;
    }

    ptr() {
        return this.data.length -1 ;
    }

    print() {
        console.log("STACK: ");
        for(let i = 0; i < this.data.length; i++) {
            console.log("    " + i + " - type: " + this.data[i].type + "; value: " + this.data[i].value);
        }
    }
}

module.exports = Stack;
