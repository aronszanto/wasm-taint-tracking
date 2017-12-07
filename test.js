var fs = require('fs');
const WAVM = require('./wasmVirtualMachine.js');
const test_file = 'tests.wasm';
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";
const tests = [
    {
        name: '_Z5test0i',
        params: [5],
        expected_output: 120,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: '_Z5test1i',
        params: [5],
        expected_output: 7,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: '_Z5test2i',
        params: [2],
        expected_output: -1,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: '_Z5test2i',
        params: [-2],
        expected_output: 1,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: '_Z5test3ii',
        params: [3, 7],
        expected_output: 6,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: '_Z5test4ii',
        params: [10, 20],
        expected_output: 14,
        expected_taint: {
            '0': 3,
            '1': 2
        }
    },
    {
        name: '_Z5test4ii',
        params: [10, -20],
        expected_output: 13,
        expected_taint: {
            '0': 3,
            '1': 2
        }
    }
];

let byte_code;
data = fs.readFileSync(test_file);
byte_code = new Uint8Array(data);

let VM = new WAVM(byte_code);
console.log('available functions: ' + VM.get_functions() + "\n");

for (let test_num = 0; test_num < tests.length; test_num++) {
//for (let test_num = 4; test_num < 5; test_num++) {
    let tst = tests[test_num];
    console.log(Reset + "Running test " + tst.name + " with parameters: " + tst.params);
    let output = VM.run_function(tst.name, tst.params);
    let res = output[0];
    if (res.value == tst.expected_output && JSON.stringify(res.taint) == JSON.stringify(tst.expected_taint)) {
        console.log(FgGreen + "Success!");
    } else {
        console.log(FgRed + "Fail!");
    }
    if (res.value == tst.expected_output) {
        console.log(FgGreen + "    Expected output: " + tst.expected_output + ". Got: " + res.value);
    } else {
        console.log(FgRed + "    Expected output: " + tst.expected_output + ". Got: " + res.value);
    }
    
    if (JSON.stringify(res.taint) == JSON.stringify(tst.expected_taint)) {
        console.log(FgGreen + "    Expected taint: " + JSON.stringify(tst.expected_taint) + ". Got: " + JSON.stringify(res.taint));
    } else {
        console.log(FgRed + "    Expected taint: " + JSON.stringify(tst.expected_taint) + ". Got: " +JSON.stringify(res.taint));
    }
    console.log(Reset);
}
    

