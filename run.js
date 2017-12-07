var fs = require('fs');
const WAVM = require('./wasmVirtualMachine.js');

let byte_code;
data = fs.readFileSync(process.argv[2]);
byte_code = new Uint8Array(data);

let VM = new WAVM(byte_code);
console.log(VM.get_functions());
let args = []

process.argv.slice(4).forEach((arg) => {
    args.push(parseInt(arg));
});
console.log(VM.run_function(process.argv[3], args));

