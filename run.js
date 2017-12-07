var fs = require('fs');
// Uncomment to test memory use 
//var HeapMetrics = require("heap-metrics");
const WAVM = require('./wasmVirtualMachine.js');

let byte_code;
data = fs.readFileSync(process.argv[2]);
byte_code = new Uint8Array(data);

let VM = new WAVM(byte_code);
let args = []

process.argv.slice(4).forEach((arg) => {
    args.push(parseInt(arg));
});
let ret = VM.run_function(process.argv[3], args);
if (ret == -1) {
	console.log("Valid function names: "+ VM.get_functions().toString())
}
else {
	console.log(ret);
}
// Uncomment to get metrics on memory use and log to console 
//console.log(HeapMetrics.GetHeapMetrics());