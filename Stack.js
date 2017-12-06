const Variable = require('./Variable');

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
        let new_var = new Variable(this.data[idx].type, this.data[idx].value, this.data[idx].taint);
        return new_var;
    }

    set(idx, val) {
        let new_var = new Variable(val.type, val.value, val.taint);
        this.data[idx] = new_var;
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
            console.log("    " + i + " - type: " + this.data[i].type + "; value: " + this.data[i].value + "; taint: " + JSON.stringify(this.data[i].taint));
        }
    }
}

module.exports = Stack;
