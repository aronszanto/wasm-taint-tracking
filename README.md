# webAssemblyTaintTracking

## Setup:
```
npm install
```

## Running:
To run a .wasm file do the following:
```
node run.js myfile.wasm function_name [parameters]
```
For example:
```
node run.js tests.wasm test3 10 11
```
A simple compiler for C/C++ to wasm can be found at https://mbebenita.github.io/WasmExplorer/

## Testing:
Optimized code:
```
node test.js
```

Unoptimized code:
```
node tests.js -u
```
