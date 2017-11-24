const ModuleInstance = require('ModuleInstance');
const Leb = require('leb');

const custom_section_id = 0;
const type_section_id = 1;
const import_section_id = 2;
const function_section_id = 3;
const table_section_id = 4;
const memory_section_id = 5;
const global_section_id = 6;
const export_section_id = 7;
const start_section_id = 8;
const element_section_id = 9;
const code_section_id = 10;
const data_section_id = 11;

const function_type = 0x60;
const int32_type = 0x7F;
const int64_type = 0x7E;
const float32_type = 0x7D;
const float64_type = 0x7C;
const empty_result_type = 0x40;


// byte_code should be an Uint8Array
function run_module(byte_code) {
    let types = [];
    let funcAddrs = [];
    let tableAddrs = [];
    let memAddrs = [];
    let globalAddrs = [];
    let module_exports = [];

    // parse byte_code to module instance
    let i = 0;
    // check magic value
    if (byte_code[i] != 0x00 || byte_code[i+1] != 0x61 ||  byte_code[i+1] != 0x73 || byte_code[i+1] != 0x6D) {
        console.log("Malformed module");
        return -1;
    }

    // skip over magic and version
    i += 8;
    while(i < byte_code.length) {
        // should be at the start of a section
        switch(byte_code[i]) {
            case custom_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;
                // ignore for now
                i += size;
                break;

            case type_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let expected_end = i + decode.value;

                // get vector of values
                let decoded_vec = Leb.decodeUint32(byte_code, i);
                i += decoded_vec.nextIndex;
                let num_els = decoded_vec.value;

                // get type
                for (let j = 0; j < num_els; j++) {
                	// sanity check
	                if (byte_code[i] != function_type) {
	                	console.log("alignment issue when parsing");
	                	return -1;
	                }
	                i++;
                    let decoded_params = Leb.decodeUint32(byte_code, i);
                    i += decoded_params.nextIndex;
                    let num_params = decoded_params.value;
                    params = [];
                    for (let p = 0; p < num_params; p++) {
                    	params.push(byte_code[i]);
                    	i++;
                    }
                    let decoded_rets = Leb.decodeUint32(byte_code, i);
                    i += decoded_rets.nextIndex;
                    let num_rets = decoded_rets.value;
                    rets = [];
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
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // ignore for now
                i += size;
                break;

            case function_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case table_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case memory_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case global_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case export_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case start_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // ignore for now
                i += size;
                break;

            case element_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case code_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;

            case data_section_id:
                let decode = Leb.decodeUint32(byte_code, i);
                i += decode.nextIndex;
                let size = decode.value;

                // TODO
                break;
        }
    }


    let module = new ModuleInstance(types, funcAddrs, tableAddrs, memAddrs, globalAddrs, module_exports);


}
