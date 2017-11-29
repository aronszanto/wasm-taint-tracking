const ModuleInstance = require('./ModuleInstance');
const MemoryInstance = require('./MemoryInstance');
const FunctionInstance = require('./FunctionInstance');
const Limit = require('./Limit');
const Variable = require('./Variable');
const Leb = require('leb');

const custom_section_id = 0;
const type_section_id = 1;
const import_section_id = 2;
const function_section_id = 3;
const table_section_id = 4
const memory_section_id = 5;
const global_section_id = 6;
const export_section_id = 7;
const start_section_id = 8;
const element_section_id = 9;
const code_section_id = 10;
const data_section_id = 11;

const limit_min_type = 0x00;
const limit_min_max_type = 0x01;
const function_type = 0x60;
const int32_type = 0x7F;
const int64_type = 0x7E;
const float32_type = 0x7D;
const float64_type = 0x7C;
const empty_result_type = 0x40;

const expression_end_code = 0x0B;
const const_i32_op_code = 0x41;
const const_i64_op_code = 0x42;
const const_f32_op_code = 0x43;
const const_f64_op_code = 0x44;
const get_global_op_code = 0x23;

let types = [];
let func_type_idxs = [];
let funcs = [];
let tables = [];
let memories = [];
let globals = [];
let module_exports = [];

function parse_init_expression(byte_code, i) {
	let ret;
	switch(byte_code[i]) {
    	case const_i32_op_code:
    		decode = Leb.decodeInt32(byte_code, i);
            i = decode.nextIndex;
            ret = decode.value;
    		break;
    	case const_i64_op_code:
    		decode = Leb.decodeInt64(byte_code, i);
            i = decode.nextIndex;
            ret = decode.value;
    		break;
    	case const_f32_op_code:
    	case const_f64_op_code:
    		console.log("floating point operations not supported");
			return -1;
    	case get_global_op_code:
    		decode = Leb.decodeUint32(byte_code, i);
            i = decode.nextIndex;
            ret = globals[decode.value].value;
    		break;
    }
    return {
    	value: ret,
    	nextIndex: i
    };
}

// byte_code should be an Uint8Array
function run_module(byte_code) {

    // parse byte_code to module instance
    let i = 0;
    // check magic value
    if (byte_code[i] != 0x00 || byte_code[i+1] != 0x61 ||  byte_code[i+1] != 0x73 || byte_code[i+1] != 0x6D) {
        console.log("Malformed module");
        return -1;
    }

    // skip over magic and version
    i += 8;
    let decode;
    let num_els;
    let size;
    let expected_end;
    while(i < byte_code.length) {
        // should be at the start of a section
        switch(byte_code[i]) {
            case custom_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;
                // ignore for now
                i += size;
                break;

            case type_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get mem
                for (let j = 0; j < num_els; j++) {
                	// sanity check
	                if (byte_code[i] != function_type) {
	                	console.log("alignment issue when parsing");
	                	return -1;
	                }
	                i++;
                    decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let num_params = decode.value;
                    params = [];
                    for (let p = 0; p < num_params; p++) {
                    	params.push(byte_code[i]);
                    	i++;
                    }
                    decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let num_rets = decode.value;
                    let rets = [];
                    for (let p = 0; p < num_rets; p++) {
                    	rets.push(byte_code[i]);
                    	i++;
                    }
                    types.push(new FunctionType(params, rets));
                }

                // sanity check
                if (expected_end != i) {
                	console.log("alignment issue when parsing");
                	return -1;
                }
                break;
                
            case import_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // ignore for now
                i += size;
                break;

            case function_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of values
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get type_idx
                let type_idxs = []
                for (let j = 0; j < num_els; j++) {
                    let decoded_typeidx = Leb.decodeUint32(byte_code, i);
                    i = decoded_params.nextIndex;
                    func_type_idxs.push(decoded_typeidx.value);
                }

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }
                break;

            case table_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // TODO
                break;

            case memory_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of values
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get type
                for (let j = 0; j < num_els; j++) {
                    let min = undefined;
                    let max = undefined;
                    let lim_type = byte_code[i];
	                i++;
                    if (lim_type == limit_min_type || lim_type == limit_min_max_type) {
	                    // get min	
                        decode = Leb.decodeUint32(byte_code, i);
                        i = decode.nextIndex;
                        min = decode.value;
                        if (lim_type == limit_min_max_type) {
                            // get max
                            decode = Leb.decodeUint32(byte_code, i);
                            i = decode.nextIndex;
                            max = decode.value;
                        }
	                } else {
                        console.log("alignment issue when parsing");
	                	return -1;
                    }
                    mems.push(new MemoryInstance(new Limit(min, max)));
                }

                // sanity check
                if (expected_end != i) {
                	console.log("alignment issue when parsing");
                	return -1;
                }
                break;

            case global_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get array of globals
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get global
                for (let j = 0; j < num_els; j++) {
                    // get global description (type and mutability, mut is 0 or 1)
                    decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let type = decode.value;

                    // no need to decode since varuint1 (only one byte)
                    let mut = byte_code[i];
                    i++;

                    // evaluate initializer expression can be either get_global or const
                    let init_value;
                    let ret = parse_init_expression(byte_code, i);
                    init_value = ret.value;
                    i = ret.nextIndex;

                    // construct global
                    globals.push(new GlobalInstance(type, init_value, mut));
                }
                break;

            case export_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // TODO
                break;

            case start_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // ignore for now
                i += size;
                break;

            case element_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // TODO
                break;

            case code_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of functions
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get function
                for (let j = 0; j < num_els; j++) {
                    decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let func_size = decode.value;

                    // sanity check
                    if (byte_code[i + func_size - 1] != expression_end_code) {
                        console.log("malformed function in code section.");
                	    return -1;
                    }
                    let func_end = i + func_size;
                    
                    // get locals
                    let locals = [];
                   	decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let num_locals = decode.value;
                    for (let k = 0; k < num_locals; k++) {
                        decode = Leb.decodeUint32(byte_code, i);
                        i = decode.nextIndex;
                        let num_of_type = decode.value;
                        for (let p = 0; p < num_of_type; p++) {
                            locals.push(new Variable(byte_code[i]));
                        }
                        i++;
                    }

                    let code = new Uint8Array(func_end - i);
                    for (let pos = 0; i < func_end; i++) {
                        code[pos] = byte_code[i];
                        pos++;
                    }
                    funcs.push(new FunctionInstance(types[func_type_idxs[j]], locals, code));
                }
                break;

            case data_section_id:
                i++;
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of datas
                decode = Leb.decodeUint32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get data element
                for (let j = 0; j < num_els; j++) {
                    decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let mem_idx = decode.value;

                    // get offset
                    let offset;
                    let ret = parse_init_expression(byte_code, i);
                    offset = ret.value;
                    i = ret.nextIndex;

                   	// get data
                   	decode = Leb.decodeUint32(byte_code, i);
                    i = decode.nextIndex;
                    let data_len = decode.value;
                    for (let k = 0; k < data_len; k++) {
                    	memories[mem_idx].bytes[offset + k] = byte_code[i];
                    	i++;
                    }
                }

                // sanity check
                if (expected_end != i) {
                	console.log("alignment issue when parsing");
                	return -1;
                }
                break;

            default:
            	console.log("Encountered unknown section id");
               	return -1;
        }
    }

    let module = new ModuleInstance(types, funcAddrs, tableAddrs, memAddrs, globalAddrs, module_exports);
}
