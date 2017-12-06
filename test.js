var fs = require('fs');

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
                    let offset;
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
                    let offset;
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

    let module = new ModuleInstance(types, funcs, tables, memories, globals, module_exports);
    return module;
}


// var testfile = './simple.wasm';
// fs.readFile(testfile, function (err, data) {
//     if (err) throw err;
//
//     var bytecode = new Uint8Array(data);
//     // for (var j = 0; j < data.length; j++){
//     //     console.log(j+ ": " + bytecode[j]);
//     // }
//     var module = build_module(bytecode);
//     console.log(module);
//
//
//
// });
var bytecode = new Uint8Array([0,97,115,109,1,0,0,0,1,155,128,128,128,0,5,96,1,127,1,127,96,3,127,127,127,1,127,96,2,127,127,1,127,96,2,127,127,0,96,0,0,2,143,129,128,128,0,11,3,101,110,118,6,102,99,108,111,115,101,0,0,3,101,110,118,5,102,111,112,101,110,0,2,3,101,110,118,6,102,115,99,97,110,102,0,1,3,101,110,118,6,109,97,108,108,111,99,0,0,3,101,110,118,6,109,101,109,115,101,116,0,1,3,101,110,118,6,112,114,105,110,116,102,0,2,3,101,110,118,7,112,117,116,99,104,97,114,0,0,3,101,110,118,4,112,117,116,115,0,0,3,101,110,118,6,115,116,114,99,112,121,0,2,3,101,110,118,6,115,116,114,108,101,110,0,0,3,101,110,118,7,115,116,114,110,99,112,121,0,1,3,136,128,128,128,0,7,0,3,1,2,4,0,2,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,144,129,128,128,0,8,6,109,101,109,111,114,121,2,0,13,108,101,116,116,101,114,95,116,111,95,105,110,116,0,11,18,112,114,105,110,116,95,105,110,118,97,108,105,100,95,119,111,114,100,0,12,11,116,114,105,101,95,105,110,115,101,114,116,0,13,8,116,114,105,101,95,103,101,116,0,14,21,100,105,99,116,105,111,110,97,114,121,95,105,110,105,116,105,97,108,105,115,101,0,15,25,100,105,99,116,105,111,110,97,114,121,95,114,101,97,100,95,102,114,111,109,95,102,105,108,101,0,16,17,100,105,99,116,105,111,110,97,114,121,95,108,111,111,107,117,112,0,17,10,158,138,128,128,0,7,174,128,128,128,0,0,2,64,32,0,65,191,127,106,65,255,1,113,65,25,75,13,0,32,0,65,89,106,15,11,32,0,65,159,127,106,34,0,65,127,32,0,65,255,1,113,65,26,73,27,11,211,128,128,128,0,1,1,127,65,0,65,0,40,2,4,65,16,107,34,2,54,2,4,32,2,32,0,54,2,0,65,16,32,2,16,5,26,65,32,65,0,16,5,26,2,64,32,1,65,1,72,13,0,3,64,65,32,16,6,26,32,1,65,127,106,34,1,13,0,11,11,65,144,3,16,7,26,65,0,32,2,65,16,106,54,2,4,11,191,130,128,128,0,1,4,127,65,0,65,0,40,2,4,65,32,107,34,6,54,2,4,2,64,2,64,2,64,32,1,45,0,0,34,5,69,13,0,65,0,33,3,3,64,32,5,65,24,116,65,24,117,33,4,2,64,2,64,32,5,65,191,127,106,65,255,1,113,65,25,75,13,0,32,4,65,89,106,34,5,65,127,71,13,1,12,4,11,32,5,65,159,127,106,65,255,1,113,65,25,75,13,3,32,4,65,159,127,106,34,5,65,127,70,13,3,11,2,64,32,0,32,5,65,2,116,106,65,4,106,34,5,40,2,0,34,0,13,0,32,5,65,212,1,16,3,34,0,54,2,0,11,32,3,65,1,106,34,4,32,1,16,9,79,13,1,32,1,32,3,106,65,1,106,45,0,0,33,5,32,4,33,3,12,0,11,11,65,1,33,1,32,0,32,2,16,9,34,3,65,1,106,16,3,34,5,54,2,0,32,5,32,2,32,3,16,10,26,12,1,11,65,160,3,16,7,26,32,6,32,1,54,2,16,65,16,32,6,65,16,106,16,5,26,65,0,33,1,65,32,65,0,16,5,26,2,64,32,3,65,1,72,13,0,65,0,33,5,3,64,65,32,16,6,26,32,5,65,1,106,34,5,32,3,71,13,0,11,11,65,144,3,16,7,26,32,6,32,2,54,2,0,65,48,32,6,16,5,26,11,65,0,32,6,65,32,106,54,2,4,32,1,11,163,129,128,128,0,1,3,127,2,64,2,64,2,64,32,1,45,0,0,34,4,69,13,0,65,1,33,2,3,64,32,4,65,24,116,65,24,117,33,3,2,64,2,64,32,4,65,191,127,106,65,255,1,113,65,25,75,13,0,32,3,65,89,106,33,4,12,1,11,32,4,65,159,127,106,65,255,1,113,65,25,75,13,4,32,3,65,159,127,106,33,4,11,65,0,33,3,32,4,65,127,70,13,2,32,0,32,4,65,2,116,106,65,4,106,40,2,0,34,0,69,13,2,32,2,32,1,16,9,79,13,1,32,1,32,2,106,45,0,0,33,4,32,2,65,1,106,33,2,12,0,11,11,32,0,40,2,0,33,3,11,32,3,15,11,65,0,11,141,128,128,128,0,0,65,200,0,65,0,65,212,1,16,4,26,11,238,129,128,128,0,1,3,127,65,0,65,0,40,2,4,65,192,2,107,34,3,54,2,4,2,64,2,64,2,64,2,64,32,0,65,160,2,16,1,34,1,69,13,0,32,3,32,3,65,192,0,106,54,2,52,32,3,32,3,65,144,2,106,54,2,48,65,0,33,2,2,64,32,1,65,208,2,32,3,65,48,106,16,2,65,2,72,13,0,65,0,33,2,3,64,65,200,0,32,3,65,144,2,106,32,3,65,192,0,106,16,13,69,13,3,32,2,65,1,106,33,2,32,3,32,3,65,192,0,106,54,2,36,32,3,32,3,65,144,2,106,54,2,32,32,1,65,208,2,32,3,65,32,106,16,2,65,1,74,13,0,11,11,32,1,16,0,26,32,3,32,2,54,2,20,32,3,32,0,54,2,16,65,224,2,32,3,65,16,106,16,5,26,65,1,33,2,12,3,11,32,3,32,0,54,2,0,65,176,2,32,3,16,5,26,12,1,11,32,1,16,0,26,11,65,0,33,2,11,65,0,32,3,65,192,2,106,54,2,4,32,2,11,156,131,128,128,0,1,6,127,65,0,65,0,40,2,4,65,16,107,34,7,54,2,4,65,200,0,33,3,2,64,2,64,2,64,2,64,32,0,45,0,0,34,6,69,13,0,65,0,33,5,32,6,33,4,3,64,32,4,65,24,116,65,24,117,33,2,2,64,2,64,32,4,65,191,127,106,65,255,1,113,65,25,75,13,0,32,2,65,89,106,65,127,71,13,1,12,4,11,32,4,65,159,127,106,65,255,1,113,65,25,75,13,3,32,2,65,159,127,106,65,127,70,13,3,11,2,64,32,5,65,1,106,34,2,32,0,16,9,79,13,0,32,0,32,5,106,65,1,106,45,0,0,33,4,32,2,33,5,12,1,11,11,32,6,69,13,0,65,200,0,33,3,65,1,33,5,3,64,32,6,65,24,116,65,24,117,33,4,2,64,2,64,32,6,65,191,127,106,65,255,1,113,65,25,75,13,0,32,4,65,89,106,33,4,12,1,11,32,6,65,159,127,106,65,255,1,113,65,25,75,13,4,32,4,65,159,127,106,33,4,11,65,0,33,2,32,4,65,127,70,13,4,32,3,32,4,65,2,116,106,65,4,106,40,2,0,34,3,69,13,4,32,5,32,0,16,9,79,13,1,32,0,32,5,106,45,0,0,33,6,32,5,65,1,106,33,5,12,0,11,11,32,3,40,2,0,34,5,69,13,1,32,1,32,5,16,8,26,65,1,33,2,12,2,11,65,224,3,16,7,26,32,7,32,0,54,2,0,65,16,32,7,16,5,26,65,0,33,2,65,32,65,0,16,5,26,2,64,32,5,65,1,72,13,0,65,0,33,4,3,64,65,32,16,6,26,32,4,65,1,106,34,4,32,5,71,13,0,11,11,65,144,3,16,7,26,12,1,11,65,0,33,2,11,65,0,32,7,65,16,106,54,2,4,32,2,11,11,129,130,128,128,0,10,0,65,16,11,14,32,32,119,111,114,100,58,32,34,37,115,34,10,0,0,65,32,11,10,32,32,32,32,32,32,32,32,32,0,0,65,48,11,21,32,32,100,101,115,99,114,105,112,116,105,111,110,58,32,34,37,115,34,10,0,0,65,160,2,11,2,114,0,0,65,176,2,11,31,99,111,117,108,100,32,110,111,116,32,102,105,110,100,47,111,112,101,110,32,102,105,108,101,32,34,37,115,34,10,0,0,65,208,2,11,9,37,115,32,37,91,94,10,93,0,0,65,224,2,11,34,112,97,114,115,101,100,32,102,105,108,101,32,34,37,115,34,32,119,105,116,104,32,37,105,32,101,110,116,114,105,101,115,10,0,0,65,144,3,11,2,94,0,0,65,160,3,11,50,102,97,105,108,101,100,32,116,111,32,105,110,115,101,114,116,32,100,117,101,32,116,111,32,105,110,118,97,108,105,100,32,99,104,97,114,97,99,116,101,114,32,105,110,32,119,111,114,100,0,0,65,224,3,11,26,105,110,118,97,108,105,100,32,99,104,97,114,97,99,116,101,114,32,105,110,32,119,111,114,100,0]);
console.log('length of bytecode', bytecode.length)
var module = build_module(bytecode);
console.log(module);