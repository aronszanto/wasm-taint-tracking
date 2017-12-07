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
const FgYellow = "\x1b[33m";
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
    },
    {
        name: 'test10',
        params: [10],
        expected_output: 4,
        expected_taint: {
            '0': 2
        }
    },
    {
        name: 'test11',
        params: [11],
        expected_output: 10,
        expected_taint: {
            '0': 3
        }
    },
    {
        name: 'test11',
        params: [6299],
        expected_output: 6298,
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
//for (let test_num = tests.length-1; test_num < tests.length; test_num++) {
//for (let test_num = 7; test_num < 8; test_num++) {
    let tst = tests[test_num];
    console.log(Reset + "Running test " + tst.name + " with parameters: " + tst.params);
    let output = VM.run_function(tst.name, tst.params);
    if (output == -1) {
        console.log(FgRed + "Fail!");
        console.log("    Encountered error!");
        continue;
    }

    let res = output[0];
    let color = FgYellow;
    if (res.value == tst.expected_output && JSON.stringify(res.taint) == JSON.stringify(tst.expected_taint)) {
        console.log(FgGreen + "Success!");
        color = FgGreen;
    } else {
        if (res.value != tst.expected_output) {
            color = FgRed;
        } else {
            let keys = Object.keys(tst.expected_taint);
            for (let i = 0; i < keys.length; i++) {
                if (tst.expected_taint[keys[i]] == 3 && (!res.taint[keys[i]] || res.taint[keys[i]] == 2)) {
                    color = FgRed; 
                }
            }
        }
        if (color == FgRed) {
            console.log(FgRed + "Fail!");
        } else {
            console.log(FgYellow + "Missed indirect taint. This is expected");
        }
    } 
    console.log(color + "    Expected output: " + tst.expected_output + ". Got: " + res.value);
    console.log(color + "    Expected taint: " + JSON.stringify(tst.expected_taint) + ". Got: " + JSON.stringify(res.taint));
    console.log(Reset);
}
