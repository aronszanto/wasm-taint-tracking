var fs = require('fs');
const WAVM = require('./wasmVirtualMachine.js');
let test_file;
if (process.argv[2] == '-u') {
    test_file = 'tests_unoptimized.wasm';
} else {
    test_file= 'tests.wasm';
}
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";
const tests = [
    {
        name: 'test0',
        params: [5],
        expected_output: 120,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test0',
        params: [-1],
        expected_output: 1,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: 'test1',
        params: [5],
        expected_output: 7,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test2',
        params: [2],
        expected_output: -1,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: 'test2',
        params: [-2],
        expected_output: 1,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: 'test3',
        params: [3, 7],
        expected_output: 6,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test4',
        params: [10, 20],
        expected_output: 14,
        expected_taint: {
            '0': 3,
            '1': 2
        }
    },
    {
        name: 'test4',
        params: [10, -20],
        expected_output: 13,
        expected_taint: {
            '0': 3,
            '1': 2
        }
    },
    {
        name: 'test5',
        params: [5, 3],
        expected_output: 20,
        expected_taint: {
            '0': 3,
            '1': 2
        }
    },
    {
        name: 'test5',
        params: [3, 5],
        expected_output: -1,
        expected_taint: {
            '0': 2,
            '1': 2
        }
    },
    {
        name: 'test6',
        params: [1234],
        expected_output: 1234,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test7',
        params: [4321],
        expected_output: 4321,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test8',
        params: [1234, 1234],
        expected_output: 2468,
        expected_taint: {
            '0': 3,
            '1': 3
        }
    },
    {
        name: 'test9',
        params: [18],
        expected_output: 6402373705728000,
        expected_taint: {
            '0': 3
        }
    }
];

let byte_code;
let data = fs.readFileSync(test_file);
byte_code = new Uint8Array(data);

let VM = new WAVM(byte_code);
console.log("Running tests compiled with opimization\n");

for (let test_num = 0; test_num < tests.length; test_num++) {
//for (let test_num = tests.length-4; test_num < tests.length-3; test_num++) {
//for (let test_num = 7; test_num < 8; test_num++) {
    let tst = tests[test_num];
    console.log(Reset + "Running test " + tst.name + " with parameters: " + tst.params);
    let output = VM.run_function(tst.name, tst.params);
    if (output == -1) {
        console.log(FgRed + "Fail!");
        console.log("    Encounter error!");
        continue;
    }

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
