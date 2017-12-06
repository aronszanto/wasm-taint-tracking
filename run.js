var fs = require('fs');
const WAVM = require('./wasmVirtualMachine.js');

//let byte_code = new Uint8Array([0,97,115,109,1,0,0,0,1,134,128,128,128,0,1,96,1,127,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,102,97,99,116,0,0,10,186,128,128,128,0,1,180,128,128,128,0,1,2,127,65,1,33,2,2,64,32,0,65,1,72,13,0,65,1,33,2,3,64,32,2,32,0,108,33,2,32,0,65,1,74,33,1,32,0,65,127,106,33,0,32,1,13,0,11,11,32,2,11]);
   
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

