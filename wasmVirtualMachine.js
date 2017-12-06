const ModuleInstance = require('./ModuleInstance');
const MemoryInstance = require('./MemoryInstance');
const FunctionInstance = require('./FunctionInstance');
const FunctionType = require('./FunctionType');
const GlobalInstance = require('./GlobalInstance');
const ExportInstance = require('./ExportInstance');
const TableInstance = require('./TableInstance');
const Limit = require('./Limit');
const Variable = require('./Variable');
const Leb = require('leb');
const Utf8StringBytes = require("utf8-string-bytes");
const Bignum = require("bignum");

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
const label_type = 0xFF;
const frame_type = 0xFE;

/* op codes */
const expression_end_code = 0x0B;

// control instruction op codes
const unreachable_op_code = 0x00;
const nop_op_code = 0x01;
const block_op_code = 0x02;
const loop_op_code = 0x03;
const if_op_code = 0x04;
const else_op_code = 0x05;
const br_op_code = 0x0C;
const br_if_op_code = 0x0D;
const br_table_op_code = 0x0E;
const return_op_code = 0x0F;
const call_op_code = 0x10;
const call_indirect_op_code = 0x11;

// parametric op codes
const drop_op_code = 0x1A;
const select_op_code = 0x1B;

// variable op codes
const get_local_op_code = 0x20;
const set_local_op_code = 0x21;
const tee_local_op_code = 0x22;
const get_global_op_code = 0x23;
const set_global_op_code = 0x24;

// memory instruction op codes
const i32_load_op_code = 0x28;
const i64_load_op_code = 0x29;
const f32_load_op_code = 0x2A;
const f64_load_op_code = 0x2B;
const i32_load8_s_op_code = 0x2C;
const i32_load8_u_op_code = 0x2D;
const i32_load16_s_op_code = 0x2E;
const i32_load16_u_op_code = 0x2F;
const i64_load8_s_op_code = 0x30;
const i64_load8_u_op_code = 0x31;
const i64_load16_s_op_code = 0x32;
const i64_load16_u_op_code = 0x33;
const i64_load32_s_op_code = 0x34;
const i64_load32_u_op_code = 0x35;
const i32_store_op_code = 0x36;
const i64_store_op_code = 0x37;
const f32_store_op_code = 0x38;
const f64_store_op_code = 0x39;
const i32_store8_op_code = 0x3A;
const i32_store16_op_code = 0x3B;
const i64_store8_op_code = 0x3C;
const i64_store16_op_code = 0x3D;
const i64_store32_op_code = 0x3E;
const current_memory_op_code = 0x3F;
const grow_memory_op_code = 0x40;

// numeric op codes
const const_i32_op_code = 0x41;
const const_i64_op_code = 0x42;
const const_f32_op_code = 0x43;
const const_f64_op_code = 0x44;

const i32_eqz_op_code = 0x45;
const i32_eq_op_code = 0x46;
const i32_ne_op_code = 0x47;
const i32_lt_s_op_code = 0x48;
const i32_lt_u_op_code = 0x49;
const i32_gt_s_op_code = 0x4A;
const i32_gt_u_op_code = 0x4B;
const i32_le_s_op_code = 0x4C;
const i32_le_u_op_code = 0x4D;
const i32_ge_s_op_code = 0x4E;
const i32_ge_u_op_code = 0x4F;

const i64_eqz_op_code = 0x50;
const i64_eq_op_code = 0x51;
const i64_ne_op_code = 0x52;
const i64_lt_s_op_code = 0x53;
const i64_lt_u_op_code = 0x54;
const i64_gt_s_op_code = 0x55;
const i64_gt_u_op_code = 0x56;
const i64_le_s_op_code = 0x57;
const i64_le_u_op_code = 0x58;
const i64_ge_s_op_code = 0x59;
const i64_ge_u_op_code = 0x5A;

const f32_eq_op_code = 0x5B;
const f32_ne_op_code = 0x5C;
const f32_lt_op_code = 0x5D;
const f32_gt_op_code = 0x5E;
const f32_le_op_code = 0x5F;
const f32_ge_op_code = 0x60;

const f64_eq_op_code = 0x61;
const f64_ne_op_code = 0x62;
const f64_lt_op_code = 0x63;
const f64_gt_op_code = 0x64;
const f64_le_op_code = 0x65;
const f64_ge_op_code = 0x66;

const i32_clz_op_code = 0x67;
const i32_ctz_op_code = 0x68;
const i32_popcnt_op_code = 0x69;
const i32_add_op_code = 0x6A;
const i32_sub_op_code = 0x6B;
const i32_mul_op_code = 0x6C;
const i32_div_s_op_code = 0x6D;
const i32_div_u_op_code = 0x6E;
const i32_rem_s_op_code = 0x6F;
const i32_rem_u_op_code = 0x70;
const i32_and_op_code = 0x71;
const i32_or_op_code = 0x72;
const i32_xor_op_code = 0x73;
const i32_shl_op_code = 0x74;
const i32_shr_s_op_code = 0x75;
const i32_shr_u_op_code = 0x76;
const i32_rotl_op_code = 0x77;
const i32_rotr_op_code = 0x78;

const i64_clz_op_code = 0x79;
const i64_ctz_op_code = 0x7A;
const i64_popcnt_op_code = 0x7B;
const i64_add_op_code = 0x7C;
const i64_sub_op_code = 0x7D;
const i64_mul_op_code = 0x7E;
const i64_div_s_op_code = 0x7F;
const i64_div_u_op_code = 0x80;
const i64_rem_s_op_code = 0x81;
const i64_rem_u_op_code = 0x82;
const i64_and_op_code = 0x83;
const i64_or_op_code = 0x84;
const i64_xor_op_code = 0x85;
const i64_shl_op_code = 0x86;
const i64_shr_s_op_code = 0x87;
const i64_shr_u_op_code = 0x88;
const i64_rotl_op_code = 0x89;
const i64_rotr_op_code = 0x8A;

const f32_abs_op_code = 0x8B;
const f32_neg_op_code = 0x8C;
const f32_ceil_op_code = 0x8D;
const f32_floor_op_code = 0x8E;
const f32_trunc_op_code = 0x8F;
const f32_nearest_op_code = 0x90;
const f32_sqrt_op_code = 0x91;
const f32_add_op_code = 0x92;
const f32_sub_op_code = 0x93;
const f32_mul_op_code = 0x94;
const f32_dic_op_code = 0x95;
const f32_min_op_code = 0x96;
const f32_max_op_code = 0x97;
const f32_copysign_op_code = 0x98;

const f64_abs_op_code = 0x99;
const f64_neg_op_code = 0x9A;
const f64_ceil_op_code = 0x9B;
const f64_floor_op_code = 0x9C;
const f64_trunc_op_code = 0x9D;
const f64_nearest_op_code = 0x9E;
const f64_sqrt_op_code = 0x9F;
const f64_add_op_code = 0xA0;
const f64_sub_op_code = 0xA1;
const f64_mul_op_code = 0xA2;
const f64_dic_op_code = 0xA3;
const f64_min_op_code = 0xA4;
const f64_max_op_code = 0xA5;
const f64_copysign_op_code = 0xA6;

const i32_wrap_i64_op_code = 0xA7;
const i32_trunc_s_f32_op_code = 0xA8;
const i32_trunc_u_f32_op_code = 0xA9;
const i32_trunc_s_f64_op_code = 0xAA;
const i32_trunc_u_f64_op_code = 0xAB;
const i64_extend_s_i32_op_code = 0xAC;
const i64_extend_u_i32_op_code = 0xAD;
const i64_trunc_s_f32_op_code = 0xAE;
const i64_trunc_u_f32_op_code = 0xAF;
const i64_trunc_s_f64_op_code = 0xB0;
const i64_trunc_u_f64_op_code = 0xB1;
const f32_convert_s_i32_op_code = 0xB2;
const f32_convert_u_i32_op_code = 0xB3;
const f32_convert_s_i64_op_code = 0xB4;
const f32_convert_u_i64_op_code = 0xB5;
const f32_denote_f64_op_code = 0xB6;
const f64_convert_s_i32_op_code = 0xB7;
const f64_convert_u_i32_op_code = 0xB8;
const f64_convert_s_i64_op_code = 0xB9;
const f64_convert_u_i64_op_code = 0xBA;
const f64_promote_f32_op_code = 0xBB;
const i32_reinterpret_f32_op_code = 0xBC;
const i64_reinterpret_f64_op_code = 0xBD;
const f32_reinterpret_i32_op_code = 0xBE;
const f64_reinterpret_i64_op_code = 0xBF;


const TRAP_CODE = -2;

// module building blocks
let types = [];
let func_type_idxs = [];
let funcs = [];
let tables = [];
let memories = [];
let globals = [];
let module_exports = [];
let start = undefined;

function parse_init_expression(byte_code, i) {
    let ret;
    switch(byte_code[i]) {
        case const_i32_op_code:
            i++;
            decode = Leb.decodeInt32(byte_code, i);
            i = decode.nextIndex;
            ret = decode.value;
            break;
        case const_i64_op_code:
            i++;
            decode = Leb.decodeInt64(byte_code, i);
            i = decode.nextIndex;
            ret = decode.value;
            break;
        case const_f32_op_code:
        case const_f64_op_code:
            console.log("floating point operations not supported");
            return -1;
        case get_global_op_code:
            i++;
            decode = Leb.decodeUInt32(byte_code, i);
            i = decode.nextIndex;
            ret = globals[decode.value].value;
            break;
    }
    if (byte_code[i] != expression_end_code){
        console.log('invalid end of expression when parsing instruction sequence');
        return -1;
    }
    i++;
    return {
        value: ret,
        nextIndex: i
    };
}

// byte_code should be an Uint8Array
function build_module(byte_code) {

    // parse byte_code to module instance
    let i = 0;
    // check magic value
    if (byte_code[i] != 0x00 || byte_code[i+1] != 0x61 ||  byte_code[i+2] != 0x73 || byte_code[i+3] != 0x6D) {
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
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;
                // ignore for now
                i += size;
                break;

            case type_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                decode = Leb.decodeUInt32(byte_code, i);
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
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let num_params = decode.value;
                    params = [];
                    for (let p = 0; p < num_params; p++) {
                      params.push(byte_code[i]);
                      i++;
                    }
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let num_rets = decode.value;
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
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                size = decode.value;

                // ignore for now
                i += size;
                break;

            case function_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of values
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get type_idx
                let type_idxs = []
                for (let j = 0; j < num_els; j++) {
                    let decoded_typeidx = Leb.decodeUInt32(byte_code, i);
                    i = decoded_typeidx.nextIndex;
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
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get array of table descriptions
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get table description
                for (let j = 0; j < num_els; j++) {
                    // table element type
                    let type = byte_code[i];
                    i++;

                    // sanity check
                    if (type != 0x70) {
                        console.log("issue with table type, can only be anyfunc");
                        return -1;
                    }

                    // get resizable limits, first the flag
                    let flags = byte_code[i];
                    i++;

                    // get minimum, always has minimum
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let min_size = decode.value;

                    // if bit 0x1 is set in flags get maximum
                    let max_size = undefined;
                    if (flags == 1) {
                        decode = Leb.decodeUInt32(byte_code, i);
                        i = decode.nextIndex;
                        max_size = decode.value;
                    }

                    // construct table
                    tables.push(new TableInstance(type, min_size, max_size, []));
                }

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }

                break;


            case memory_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of values
                decode = Leb.decodeUInt32(byte_code, i);
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
                        decode = Leb.decodeUInt32(byte_code, i);
                        i = decode.nextIndex;
                        min = decode.value;
                        if (lim_type == limit_min_max_type) {
                            // get max
                            decode = Leb.decodeUInt32(byte_code, i);
                            i = decode.nextIndex;
                            max = decode.value;
                        }
                  } else {
                        console.log("alignment issue when parsing");
                    return -1;
                    }
                    memories.push(new MemoryInstance(new Limit(min, max)));
                }

                // sanity check
                if (expected_end != i) {
                  console.log("alignment issue when parsing");
                  return -1;
                }
                break;

            case global_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get array of globals
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get global
                for (let j = 0; j < num_els; j++) {
                    // get global description (type and mutability, mut is 0 or 1)
                    let type = byte_code[i];
                    i++;

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

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }

                break;

            case export_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get array of exports
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get export instance
                for (let j = 0; j < num_els; j++) {
                    // get name (identifier: byte array wich is valid UTF-8)
                    let name_byte_array = [];
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let len = decode.value;

                    for (let k = 0; k < len; k++) {
                        name_byte_array.push(byte_code[i]);
                        i++;
                    }

                    // decode byte array to string
                    let name = Utf8StringBytes.utf8ByteArrayToString(name_byte_array);

                    // get export kind (func, table, mem or global)
                    let kind = byte_code[i];
                    i++;

                    // get index (address in list of kind)
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let index = decode.value;

                    // construct export
                    module_exports.push(new ExportInstance(name, kind, index));
                }

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }

                break;

            case start_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get the index of the start function
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                start = decode.value;

                // sanity check
                if (expected_end != i) {
                  console.log("alignment issue when parsing");
                  return -1;
                }

                break;

            case element_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get array of table initializers
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get table initializer
                for (let j = 0; j < num_els; j++) {
                    // get table index
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let table_index = decode.value;

                    // get offset
                    let ret = parse_init_expression(byte_code, i);
                    offset = ret.value;
                    i = ret.nextIndex;

                    // get elements (array of function indices)
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    len = decode.value;

                    // sanity check:
                    if (offset + len > tables[table_index].max_size) {
                        console.log("table element indexing issue");
                        return -1;
                    }

                    for (let k = 0; k < len; k++) {
                        // get func index
                        decode = Leb.decodeUInt32(byte_code, i);
                        i = decode.nextIndex;
                        func_index = decode.value;

                        // store func index at offset in element list
                        tables[table_index].elements[offset + k] = func_index;
                    }
                }

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }
                break;

            case code_section_id:
                i++;

                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of functions
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;

                // get function
                for (let j = 0; j < num_els; j++) {
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let func_size = decode.value;

                    // sanity check
                    if (byte_code[i + func_size - 1] != expression_end_code) {
                      return -1;
                    }
                    let func_end = i + func_size;

                    // get locals
                    let locals = [];
                    decode = Leb.decodeUInt32(byte_code, i);

                    i = decode.nextIndex;
                    let num_locals = decode.value;
                    for (let k = 0; k < num_locals; k++) {
                        decode = Leb.decodeUInt32(byte_code, i);
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

                // sanity check
                if (expected_end != i) {
                    console.log("alignment issue when parsing");
                    return -1;
                }

                break;

            case data_section_id:
                i++;
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                expected_end = i + decode.value;

                // get vector of datas
                decode = Leb.decodeUInt32(byte_code, i);
                i = decode.nextIndex;
                num_els = decode.value;
                // get data element
                for (let j = 0; j < num_els; j++) {
                    decode = Leb.decodeUInt32(byte_code, i);
                    i = decode.nextIndex;
                    let mem_idx = decode.value;
                    // get offset
                    let ret = parse_init_expression(byte_code, i);
                    if (ret == -1){
                        return -1;
                    }
                    offset = ret.value;
                    i = ret.nextIndex;

                     // get data
                    decode = Leb.decodeUInt32(byte_code, i);
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

    let module = new ModuleInstance(funcs, tables, memories, globals, module_exports);
    return module;
}
// mod is of type ModuleInstance
// function_idx is an int
// params is an array of Variables
function run_function(mod, function_idx, params) {
    let old_func = mod.funcs[function_idx];

    // Validate parameters
    if (old_func.type.params.length != params.length) {
        console.log("mismatching number of params for function " + function_idx);
        return -1;
    }

    for (let i = 0; i < params.length; i++) {
        if (params[i].type != old_func.type.params[i]) {
            console.log("Invalid parameter type for function " + function_idx + ". expected: "
                + old_func.type.params[i] + ". Got: " + params[i].type + ".");
            return -1;
        }
    }


    let new_type = new FunctionType(old_func.type.params, old_func.type.returns);
    let new_locs = params;
    for (let lcl = 0; lcl < old_func.locals.length; lcl++) {
        let new_lcl = new Variable(old_func.locals[lcl].type, 0);
        new_locs.push(new_lcl);
    }
    let func = new FunctionInstance(new_type, new_locs, old_func.code);
    
    // push the function frame onto the stack
    mod.stack.push(new Variable(frame_type, 0));

    // push the params onto the stack and locals
    params.forEach((el) => {
        mod.stack.push(el);
    });


    let labels = [];

    // execute the code
    let code_ptr = 0;
    let type;
    let label;
    let ret_val;
    let idx;
    let top_val;
    let val1;
    let val2;
    let popped;
    let popped_val;
    let offset;
    let align;
    let mem;
    let opt;
    let ea;
    let i;
    let c;
    let N;
    let sz;
    let b;
    let dataview;
    let call_params;
    let rets;
    let ret_type;
    let new_var;
    while (code_ptr < func.code.length) {
        op_code = func.code[code_ptr];
        console.log("evaluating opcode: " + op_code + " at :" + code_ptr)
        switch (op_code) {

            // control instruction op codes
            case unreachable_op_code:
                return TRAP_CODE;
            case nop_op_code:
                // Do nothing
                code_ptr++;
                break;
            case block_op_code:
                // get block type
                code_ptr++;
                type = func.code[code_ptr];
                code_ptr++;
                labels.push(
                    {
                        block_type: block_op_code,
                        ret_type: type,
                        start: code_ptr-2
                    }
                );
                mod.stack.push(new Variable(label_type, 0));
                break;
            case loop_op_code:
                // get block type
                code_ptr++;
                type = func.code[code_ptr];
                code_ptr++;
                labels.push(
                    {
                        block_type: loop_op_code,
                        ret_type: type,
                        start: code_ptr-2
                    }
                );
                mod.stack.push(new Variable(label_type, 0));
                break;
            case if_op_code:
                code_ptr++;
                let test_val = mod.stack.pop();
                if (test_val.type != int32_type) {
                    console.log("invalid test type at the top of the stack");
                    return -1;
                }
                if (test_val.value != 0) {
                    // get block type
                    type = func.code[code_ptr];
                    code_ptr++;
                    labels.push(
                        {
                            block_type: if_op_code,
                            ret_type: type,
                            start: code_ptr-2
                        }
                    );
                    mod.stack.push(new Variable(label_type, 0));
                } else {
                    // skip to either end or else
                    while (func.code[code_ptr] != else_op_code || func.code[code_ptr] != expression_end_code) {
                        code_ptr++;
                    }

                    if (func.code[code_ptr] == else_op_code) {
                        // get block type
                        type = func.code[code_ptr];
                        code_ptr++;
                        labels.push(
                            {
                                block_type: if_op_code,
                                ret_type: type,
                                start: code_ptr-2
                            }
                        );
                        mod.stack.push(new Variable(label_type, 0));
                    }
                }
                break;
            case else_op_code:
                // skip until end
                while (func.code[code_ptr] != expression_end_code) {
                    code_ptr++;
                }
                break;
            case expression_end_code:
                // end of function
                if (code_ptr == func.code.length -1) {
                    if (mod.stack.len() < func.type.returns.length + 1) {
                        console.log("not enough values on stack when returning");
                        return -1;
                    }

                    // get return values
                    rets = [];
                    for (popped = 0; popped < func.type.returns.length; popped++) {
                        rets.push(mod.stack.pop());
                        if (rets[0].type != func.type.returns[popped]) {
                            console.log("invalid value popped from the stack during a return");
                            return -1;
                        }
                    }

                    // clear function frame from stack
                    popped_val = mod.stack.pop();
                    while (popped_val.type != frame_type) {
                        popped_val = mod.stack.pop();
                    }

                    // push results back onto the frame
                    rets.forEach((ret_val) => {
                        mod.stack.push(ret_val);
                    });

                    return rets;
                }
                label = labels.pop();
                ret_val = null;
                if (label.ret_type != empty_result_type) {
                    if (mod.stack.len() <= 0) {
                        console.log("stack is empty at label end");
                        return -1;
                    }
                    ret_val = mod.stack.pop();
                    if (ret_val.type != label[ret_type]) {
                        console.log("invalid value on top of stack at the end of an expression");
                        return -1;
                    }
                }
                if (mod.stack.len() <= 0) {
                    console.log("stack is empty at label end");
                    return -1;
                }
                let stack_label = mod.stack.pop();
                if (stack_label.type != label_type) {
                    console.log("stack_label missing at the end of expression");
                    return -1;
                }
                if (ret_val != null) {
                    mod.stack.push(ret_val);
                }
                if (label[block_type] == loop_op_code) {
                    code_ptr = label[start];
                } else {
                    code_ptr++;
                }

                break;
            case br_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (labels.length < idx) {
                    console.log("invalid break. label index is wrong");
                    return -1;
                }
                label = labels[idx];
                ret_val = null;
                if (label[ret_type] != empty_result_type) {
                    if (mod.stack.len() <= 0) {
                        console.log("stack is empty at label end");
                        return -1;
                    }
                    ret_val = mod.stack.pop();
                    if (ret_val.type != label[ret_type]) {
                        console.log("invalid value on top of stack at the end of an expression");
                        return -1;
                    }
                }
                popped = 0;
                while (popped < idx+1) {
                    if (mod.stack.len() <= 0) {
                        console.log("not enough labels on stack");
                        return -1;
                    }
                    let stack_label = mod.stack.pop();
                    if (stack_label.type == label_type) {
                        popped++;
                    }
                }
                if (ret_val != null) {
                    mod.stack.push(ret_val);
                }

                // remove old labels
                for (let lbl = 0; lbl <= idx; lbl++) {
                    labels.pop();
                }

                // go to the end of the block
                while (popped > 0) {
                    if (func.code[code_ptr] == expression_end_code) {
                        popped--;
                    }
                    code_ptr++;
                } 

                break;
            case br_if_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (labels.length < idx) {
                    console.log("invalid break. label index is wrong");
                    return -1;
                }

                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -2;
                }

                top_val = mod.stack.pop();
                if (top_val.type != int32_type) {
                    console.log("value of invalid type on top of stack");
                    return -1;
                }

                if (top_val.value != 0) {
                    label = labels[idx];
                    ret_val = null;
                    if (label.ret_type != empty_result_type) {
                        if (mod.stack.len() <= 0) {
                            console.log("stack is empty at label end");
                            return -1;
                        }
                        ret_val = mod.stack.pop();
                        if (ret_val.type != label.ret_type) {
                            console.log("invalid value on top of stack at the end of an expression");
                            return -1;
                        }
                    }
                    popped = 0;
                    while (popped < idx+1) {
                        if (mod.stack.len() <= 0) {
                            console.log("not enough labels on stack");
                            return -1;
                        }
                        let stack_label = mod.stack.pop();
                        if (stack_label.type == label_type) {
                            popped++;
                        }
                    }
                    if (ret_val != null) {
                        mod.stack.push(ret_val);
                    }

                    // remove old labels
                    for (let lbl = 0; lbl <= idx; lbl++) {
                        labels.pop();
                    }

                    // go to the end of the block
                    while (popped > 0) {
                        if (func.code[code_ptr] == expression_end_code) {
                            popped--;
                        }
                        code_ptr++;
                    }
                    code_ptr++;

                } else {
                    code_ptr++;
                }
                break;
            case br_table_op_code:
                code_ptr++;
                // get labels
                let op_labels = [];
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                let num_labels = decode.value;
                for (let k = 0; k < num_labels; k++) {
                    decode = Leb.decodeUInt32(func.code, code_ptr);
                    code_ptr = decode.nextIndex;
                    let lbl = decode.value;
                    op_labels.push(lbl);
                }

                // get default index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (labels.length < idx) {
                    console.log("invalid break. label index is wrong");
                    return -1;
                }

                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -2;
                }

                top_val = mod.stack.pop();
                if (top_val.type != int32_type) {
                    console.log("value of invalid type on top of stack");
                    return -1;
                }

                if (top_val.value < op_labels.length) {
                    idx = op_labels[top_val.value];
                }

                label = labels[idx];
                ret_val = null;
                if (label[ret_type] != empty_result_type) {
                    if (mod.stack.len() <= 0) {
                        console.log("stack is empty at label end");
                        return -1;
                    }
                    ret_val = mod.stack.pop();
                    if (ret_val.type != label[ret_type]) {
                        console.log("invalid value on top of stack at the end of an expression");
                        return -1;
                    }
                }
                popped = 0;
                while (popped < idx+1) {
                    if (mod.stack.len() <= 0) {
                        console.log("not enough labels on stack");
                        return -1;
                    }
                    let stack_label = mod.stack.pop();
                    if (stack_label.type == label_type) {
                        popped++;
                    }
                }
                if (ret_val != null) {
                    mod.stack.push(ret_val);
                }

                // remove old labels
                for (let lbl = 0; lbl <= idx; lbl++) {
                    labels.pop();
                }

                // go to the end of the block
                while (popped > 0) {
                    if (func.code[code_ptr] == expression_end_code) {
                        popped--;
                    }
                    code_ptr++;
                }
                break;
            case return_op_code:
                if (mod.stack.len() < func.type.returns.length + 1) {
                    console.log("not enough values on stack when returning");
                    return -1;
                }

                // get return values
                rets = [];
                for (popped = 0; popped < func.type.returns.length; popped++) {
                    rets.push(mod.stack.pop());
                    if (rets[0].type != func.type.returns[popped]) {
                        console.log("invalid value popped from the stack during a return");
                        return -1;
                    }
                }

                // clear function frame from stack
                popped_val = mod.stack.pop();
                while (popped_val.type != frame_type) {
                    popped_val = mod.stack.pop();
                }

                // push results back onto the frame
                rets.forEach((ret_val) => {
                    mod.stack.push(ret_val);
                });

                return rets;
            case call_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (idx >= mod.funcs.length) {
                    console.log("Invalid function index in call operations");
                    return -1;
                }

                // get params
                if (mod.stack.len() < mod.funcs[idx].type.params.length) {
                    console.log("not enough values on stack when calling a function");
                    return -1;
                }

                call_params = [];
                for (popped = 0; popped < mod.funcs[idx].type.params.length; popped++) {
                    call_params.push(mod.stack.pop());
                    if (call_params[0].type != mod.funcs[idx].type.params[popped]) {
                        console.log("invalid value popped from the stack during a function call");
                        return -1;
                    }
                }

                rets = run_function(mod, idx, call_params);
                if (rets == -1) {
                    console.log("function call failed");
                    return -1;
                }

                break;
            case call_indirect_op_code:
                code_ptr++;
                if (mod.tables.length < 1) {
                    console.log("tried to do an indirect function call without tables");
                    return -1;
                }

                // get type_idx
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (idx >= mod.funcs.length) {
                    console.log("invalid function index in call indirect");
                    return -1;
                }

                // sanity check
                if (func.code[code_ptr] != 0x00) {
                    console.log("malformed call indirect code");
                    return -1;
                }
                code_ptr++;

                let table_idx = mod.stack.pop();
                if (table_idx.type != int32_type) {
                    console.log("invalid table index on top of stack in call indirect");
                    return -1;
                }

                if (mod.tables[0].elements[table_index] == undefined) {
                    console.log("hit an uninitialzed table element in call indirect");
                    return -1;
                }

                if (mod.tables[0].elements[table_index] != idx) {
                    console.log("malformed call indirect");
                    return -1;
                }

                if (idx >= mod.funcs.length) {
                    console.log("Invalid function index in call operations");
                    return -1;
                }

                // get params
                if (mod.stack.len() < mod.funcs[idx].type.params.length) {
                    console.log("not enough values on stack when calling a function");
                    return -1;
                }

                call_params = [];
                for (popped = 0; popped < mod.funcs[idx].type.params.length; popped++) {
                    call_params.push(mod.stack.pop());
                    if (call_params[0].type != mod.funcs[idx].type.params[popped]) {
                        console.log("invalid value popped from the stack during a function call");
                        return -1;
                    }
                }

                rets = run_function(mod, idx, call_params);
                if (rets == -1) {
                    console.log("function call failed");
                    return -1;
                }

                break;

            // parametric op codes
            case drop_op_code:
                if (mod.stack.len() <= 0) {
                    console.log("tried to drop from an empty stack");
                    return -1;
                }
                mod.stack.pop();
                code_ptr++;
                break;
            case select_op_code:
                if (mod.stack.len() < 3) {
                    console.log("tried to select from a too-empty stack");
                    return -1;
                }
                let cond = mod.stack.pop();
                let var1 = mod.stack.pop();
                let var2 = mod.stack.pop();
                if (cond.type != int32_type) {
                    console.log("invalid condition variable in select operation");
                    return -1;
                }
                if (var1.type != var2.type) {
                    console.log("mismatching value types in select operation");
                    return -1;
                }
                if (cond.value == 0) {
                    mod.stack.push(val2);
                } else {
                    mod.stack.push(val1);
                }
                code_ptr++;
                break;

            // variable op codes
            case get_local_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (func.locals.length <= idx) {
                    console.log("Invalid local index. locals len is: " + func.locals.length + ". idx is: " + idx);
                    return -1;
                }
                mod.stack.push(func.locals[idx]);
                break;
            case set_local_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (func.locals.length <= idx) {
                    console.log("Invalid local index. locals len is: " + func.locals.length + ". idx is: " + idx);
                    return -1;
                }

                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in set local");
                    return -1;
                }

                func.locals[idx] = mod.stack.pop();
                break;
            case tee_local_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (func.locals.length <= idx) {
                    console.log("Invalid local index. locals len is: " + func.locals.length + ". idx is: " + idx);
                    return -1;
                }
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in tee local");
                    return -1;
                }
                func.locals[idx] = mod.stack.pop();
                mod.stack.push(func.local[idx]);
                break;
            case get_global_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (mod.globals.length <= idx) {
                    console.log("Invalid global index. locals len is: " + mod.globals.length + ". idx is: " + idx);
                    return -1;
                }
                new_var = new Variable(mod.globals[idx].type, mod.globals[idx].value);
                mod.stack.push(new_var);
                break;
            case set_global_op_code:
                code_ptr++;
                // get index
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                idx = decode.value;
                if (mod.globals.length <= idx) {
                    console.log("Invalid global index. locals len is: " + mod.globals.length + ". idx is: " + idx);
                    return -1;
                }
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in set global");
                    return -1;
                }
                if (!mod.globals[idx].mutable) {
                    console.log("trying to set unmutable global");
                    return -1;
                }
                mod.globals[idx].value = mod.stack.pop().value;
                break;

            // memory instruction op codes
            case i32_load_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 32;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                // read buffer with little endian storage
                dataView = new DataView(b.buffer);
                c = dataView.getUint32(true);

                // push loaded value to the stack
                new_var = Variable(int32_type, c);
                mod.stack.push(new_var);
                break;

            case i64_load_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 64;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                // read buffer with little endian storage
                opt = {
                    endian : 'little',
                    size : 1
                };
                c = Bignum.fromBuffer(b, opt);

                // push loaded value to the stack
                new_var = Variable(int64_type, c);
                mod.stack.push(new_var);
                break;

            case f32_load_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_load_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_load8_s_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint8(true);
                if (c > Math.pow(2, 32)) {
                    c -= Math.pow(2, 32);
                }

                // push loaded value to the stack
                new_var = Variable(int32_type, c);
                mod.stack.push(new_var);
                break;

            case i32_load8_u_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint8(true);

                // push loaded value to the stack
                new_var = Variable(int32_type, c);
                mod.stack.push(new_var);
                break;

            case i32_load16_s_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint16(true);
                if (c > Math.pow(2, 32)) {
                    c -= Math.pow(2, 32);
                }
                // push loaded value to the stack
                new_var = Variable(int32_type, c);
                mod.stack.push(new_var);
                break;

            case i32_load16_u_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint16(true);

                // push loaded value to the stack
                new_var = Variable(int32_type, c);
                mod.stack.push(new_var);
                break;

            case i64_load8_s_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint8(true);
                if (c > Math.pow(2, 32)) {
                    c -= Math.pow(2, 32);
                }


                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i64_load8_u_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint8(true);

                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i64_load16_s_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint16(true);
                if (c > Math.pow(2, 32)) {
                    c -= Math.pow(2, 32);
                }

                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i64_load16_u_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint16(true);

                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i64_load32_s_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 32;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint32(true);
                if (c > Math.pow(2, 32)) {
                    c -= Math.pow(2, 32);
                }

                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i64_load32_u_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in load op");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during load");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during load");
                    return -1;
                }
                N = 32;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr");
                    return -1;
                }
                // read memory
                b = mem.slice(ea, ea + N/8);
                dataView = new DataView(b.buffer);
                c = dataView.getUint32(true);

                // push loaded value to the stack
                new_var = Variable(int64_type, Bignum.bignum(c));
                mod.stack.push(new_var);
                break;

            case i32_store_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 32;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint32(0, c.value, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;
            case i64_store_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                if (!Bignum.isBigNum(c.value)) {
                    console.log("expecting bignum on stack in store 64");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 64;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                // write buffer
                opt = {
                    endian : 'little',
                    size : 1
                };
                b = c.toBuffer(opt);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;
            case f32_store_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_store_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_store8_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                n = c.value % Math.pow(2, N);
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint8(0, n, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;

            case i32_store16_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                n = c.value % Math.pow(2, N);
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint16(0, n, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;

            case i64_store8_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int64_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                if (!Bignum.isBigNum(c.value)) {
                    console.log("expecting bignum on stack in store 64");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 8;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                n = c.value.mod(Math.pow(2, N)).toNumber();
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint8(0, n, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;

            case i64_store16_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                if (!Bignum.isBigNum(c.value)) {
                    console.log("expecting bignum on stack in store 64");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int64_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 16;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                n = c.value.mod(Math.pow(2, N)).toNumber();
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint16(0, n, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;

            case i64_store32_op_code:
                // get memarg, start with offset
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                offset = decode.value;
                // then get align
                decode = Leb.decodeUInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                align = decode.value;

                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                if (mod.stack.len() <= 1) {
                    console.log("Empty stack in store op");
                    return -1;
                }
                // get value to be stored from stack
                c = mod.stack.pop();
                if (c.type != int64_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                if (!Bignum.isBigNum(c.value)) {
                    console.log("expecting bignum on stack in store 64");
                    return -1;
                }
                // get mem idx from stack
                i = mod.stack.pop();
                if (i.type != int32_type) {
                    console.log("mismatching type in stack variable during store");
                    return -1;
                }
                ea = i.value + offset;
                if (ea % Math.pow(2, align) != 0) {
                    console.log("alignment issue during store");
                    return -1;
                }
                N = 32;
                if (ea + N/8 > mem.len()) {
                    console.log("trying to read unset memory addr during store");
                    return -1;
                }
                n = c.value.mod(Math.pow(2,N)).toNumber();
                // write buffer
                b = new Uint8Array(N/8);
                dataView = new DataView(b.buffer);
                dataView.setUint32(0, n, true);

                // store buffer to memory
                for (let j = 0; j < N/8; j++) {
                    mem[ea + j] = b[j];
                }
                break;

            case current_memory_op_code:
                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;

                sz = mem.len() / MemoryInstance.page_size;  // defined in memory instancce

                // push size to the stack
                 new_var = Variable(int32_type, sz);
                mod.stack.push(new_var);
                break;

            case grow_memory_op_code:
                // get memory instance
                if (!mod.memories[0]) {
                    console.log("trying to read unset memory instace");
                    return -1;
                }
                mem = mod.memories[0].bytes;
                sz = mem.len() / MemoryInstance.page_size;  // defined in memory instancce

                if (mod.stack.len() <= 0) {
                    console.log("Empty stack in grow mem op");
                    return -1;
                }
                // get size of memory growth from stack
                n = mod.stack.pop();
                if (n.type != int32_type) {
                    console.log("mismatching type in stack variable during grow mem");
                    return -1;
                }
                // extend the memory
                mem.length += n * MemoryInstance.page_size;

                // TODO check if the operation was successful above, for the moment we assume ok

                // push size to the stack
                new_var = Variable(int32_type, sz);
                mod.stack.push(new_var);

                break;

            // numeric op codes
            case const_i32_op_code:
                code_ptr++;
                decode = Leb.decodeInt32(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                mod.stack.push(new Variable(int32_type, decode.value));
                break;
            case const_i64_op_code:
                code_ptr++;
                decode = Leb.decodeInt64(func.code, code_ptr);
                code_ptr = decode.nextIndex;
                mod.stack.push(new Variable(int64_type, decode.value));
                break;
            case const_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case const_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_eqz_op_code:
                if (mod.stack.len() <= 0) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                top_val = mod.stack.pop();
                if (top_val.type != int32_type) {
                    console.log("value of invalid type on top of stack");
                    return -1;
                }

                if (top_val.value == 0) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_eq_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val1 = mod.stack.pop();
                val2 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value == val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_ne_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val1 = mod.stack.pop();
                val2 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type +". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value != val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_lt_s_op_code:
            case i32_lt_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value < val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_gt_s_op_code:
            case i32_gt_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value > val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_le_s_op_code:
            case i32_le_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value <= val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i32_ge_s_op_code:
            case i32_ge_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int32_type || val2.type != int32_type) {
                    console.log("values of invalid types on top of stack. expected: " + int32_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (val1.value >= val2.value) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;

            case i64_eqz_op_code:
                if (mod.stack.len() <= 0) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                top_val = mod.stack.pop();
                if (top_val.type != int64_type) {
                    console.log("value of invalid type on top of stack");
                    return -1;
                }

                if (!Bignum.isBigNum(top_val.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (top_val.value.eq(0)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_eq_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val1 = mod.stack.pop();
                val2 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (val1.value.eq(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_ne_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val1 = mod.stack.pop();
                val2 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (!val1.value.eq(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_lt_s_op_code:
            case i64_lt_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (val1.value.lt(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_gt_s_op_code:
            case i64_gt_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (val1.value.gt(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_le_s_op_code:
            case i64_le_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (val1.value.le(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;
            case i64_ge_s_op_code:
            case i64_ge_u_op_code:
                if (mod.stack.len() <= 1) {
                    console.log("Stack does not contain enough elements");
                    return -1;
                }

                val2 = mod.stack.pop();
                val1 = mod.stack.pop();
                if (val1.type != int64_type || val2.type != int64_type) {
                    console.log("values of invalid types on top of stack. expected: " + int64_type + ". got:" + val1.type + ", " + val2.type);
                    return -1;
                }

                if (!Bignum.isBigNum(val1.value) || !Bignum.isBigNum(val2.value)) {
                    console.log("expected bignum, but didn't get one.");
                }

                if (val1.value.ge(val2.value)) {
                    mod.stack.push(new Variable(int32_type, 1));
                } else {
                    mod.stack.push(new Variable(int32_type, 0));
                }

                code_ptr++;
                break;

            case f32_eq_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_ne_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_lt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_gt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_le_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_ge_op_code:
                console.log("floating point operations are not supported");
                return -1;

            case f64_eq_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_ne_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_lt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_gt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_le_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_ge_op_code:
                console.log("floating point operations are not supported");
                return -1;

            case i32_clz_op_code:
                //TODO
                break;
            case i32_ctz_op_code:
                //TODO
                break;
            case i32_popcnt_op_code:
                //TODO
                break;
            case i32_add_op_code:
                //TODO
                break;
            case i32_sub_op_code:
                //TODO
                break;
            case i32_mul_op_code:
                //TODO
                break;
            case i32_div_s_op_code:
                //TODO
                break;
            case i32_div_u_op_code:
                //TODO
                break;
            case i32_rem_s_op_code:
                //TODO
                break;
            case i32_rem_u_op_code:
                //TODO
                break;
            case i32_and_op_code:
                //TODO
                break;
            case i32_or_op_code:
                //TODO
                break;
            case i32_xor_op_code:
                //TODO
                break;
            case i32_shl_op_code:
                //TODO
                break;
            case i32_shr_s_op_code:
                //TODO
                break;
            case i32_shr_u_op_code:
                //TODO
                break;
            case i32_rotl_op_code:
                //TODO
                break;
            case i32_rotr_op_code:
                //TODO
                break;

            case i64_clz_op_code:
                //TODO
                break;
            case i64_ctz_op_code:
                //TODO
                break;
            case i64_popcnt_op_code:
                //TODO
                break;
            case i64_add_op_code:
                //TODO
                break;
            case i64_sub_op_code:
                //TODO
                break;
            case i64_mul_op_code:
                //TODO
                break;
            case i64_div_s_op_code:
                //TODO
                break;
            case i64_div_u_op_code:
                //TODO
                break;
            case i64_rem_s_op_code:
                //TODO
                break;
            case i64_rem_u_op_code:
                //TODO
                break;
            case i64_and_op_code:
                //TODO
                break;
            case i64_or_op_code:
                //TODO
                break;
            case i64_xor_op_code:
                //TODO
                break;
            case i64_shl_op_code:
                //TODO
                break;
            case i64_shr_s_op_code:
                //TODO
                break;
            case i64_shr_u_op_code:
                //TODO
                break;
            case i64_rotl_op_code:
                //TODO
                break;
            case i64_rotr_op_code:
                //TODO
                break;

            case f32_abs_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_neg_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_ceil_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_floor_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_trunc_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_nearest_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_sqrt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_add_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_sub_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_mul_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_dic_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_min_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_max_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_copysign_op_code:
                console.log("floating point operations are not supported");
                return -1;

            case f64_abs_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_neg_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_ceil_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_floor_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_trunc_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_nearest_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_sqrt_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_add_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_sub_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_mul_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_dic_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_min_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_max_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_copysign_op_code:
                console.log("floating point operations are not supported");
                return -1;

            case i32_wrap_i64_op_code:
                //TODO
                break;
            case i32_trunc_s_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_trunc_u_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_trunc_s_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_trunc_u_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i64_extend_s_i32_op_code:
                //TODO
                break;
            case i64_extend_u_i32_op_code:
                //TODO
                break;
            case i64_trunc_s_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i64_trunc_u_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i64_trunc_s_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i64_trunc_u_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_convert_s_i32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_convert_u_i32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_convert_s_i64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_convert_u_i64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_denote_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_convert_s_i32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_convert_u_i32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_convert_s_i64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_convert_u_i64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_promote_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i32_reinterpret_f32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case i64_reinterpret_f64_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f32_reinterpret_i32_op_code:
                console.log("floating point operations are not supported");
                return -1;
            case f64_reinterpret_i64_op_code:
                console.log("floating point operations are not supported");
                return -1;
        }
    }

    console.log("Reached end of function code without a return");
    return -1;
}


class WASMInterpreter {
    constructor(byte_code) {
        this.module = build_module(byte_code);
    }

    get_functions() {
        let names = [];
        this.module.exports.forEach((exp) => {
            names.push(exp.name);
        });
        return names;
    }

    run_function(name, params) {
        for (let k = 0; k < this.module.exports.length; k++){
            let exp = this.module.exports[k];
            if (exp.name == name) {
                // validate params
                if (params.length != this.module.funcs[exp.index].type.params.length) {
                    console.log("Invalid parameters");
                    return -1;
                }
                let var_params = [];
                let i = 0;
                this.module.funcs[exp.index].type.params.forEach((prm) => {
                    var_params.push(new Variable(prm, params[i]));
                    i++;
                });
                return run_function(this.module, exp.index, var_params);
            }
        }
        console.log("Invalid function name");
        return -1;
    }
}

module.exports = WASMInterpreter;
