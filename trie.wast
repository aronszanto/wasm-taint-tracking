(module
  (type $FUNCSIG$ii (func (param i32) (result i32)))
  (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
  (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
  (import "env" "fclose" (func $fclose (param i32) (result i32)))
  (import "env" "fopen" (func $fopen (param i32 i32) (result i32)))
  (import "env" "fscanf" (func $fscanf (param i32 i32 i32) (result i32)))
  (import "env" "malloc" (func $malloc (param i32) (result i32)))
  (import "env" "memset" (func $memset (param i32 i32 i32) (result i32)))
  (import "env" "printf" (func $printf (param i32 i32) (result i32)))
  (import "env" "putchar" (func $putchar (param i32) (result i32)))
  (import "env" "puts" (func $puts (param i32) (result i32)))
  (import "env" "strcpy" (func $strcpy (param i32 i32) (result i32)))
  (import "env" "strlen" (func $strlen (param i32) (result i32)))
  (import "env" "strncpy" (func $strncpy (param i32 i32 i32) (result i32)))
  (table 0 anyfunc)
  (memory $0 1)
  (data (i32.const 16) "  word: \"%s\"\n\00")
  (data (i32.const 32) "         \00")
  (data (i32.const 48) "  description: \"%s\"\n\00")
  (data (i32.const 288) "r\00")
  (data (i32.const 304) "could not find/open file \"%s\"\n\00")
  (data (i32.const 336) "%s %[^\n]\00")
  (data (i32.const 352) "parsed file \"%s\" with %i entries\n\00")
  (data (i32.const 400) "^\00")
  (data (i32.const 416) "failed to insert due to invalid character in word\00")
  (data (i32.const 480) "invalid character in word\00")
  (export "memory" (memory $0))
  (export "letter_to_int" (func $letter_to_int))
  (export "print_invalid_word" (func $print_invalid_word))
  (export "trie_insert" (func $trie_insert))
  (export "trie_get" (func $trie_get))
  (export "dictionary_initialise" (func $dictionary_initialise))
  (export "dictionary_read_from_file" (func $dictionary_read_from_file))
  (export "dictionary_lookup" (func $dictionary_lookup))
  (func $letter_to_int (param $0 i32) (result i32)
    (block $label$0
      (br_if $label$0
        (i32.gt_u
          (i32.and
            (i32.add
              (get_local $0)
              (i32.const -65)
            )
            (i32.const 255)
          )
          (i32.const 25)
        )
      )
      (return
        (i32.add
          (get_local $0)
          (i32.const -39)
        )
      )
    )
    (select
      (tee_local $0
        (i32.add
          (get_local $0)
          (i32.const -97)
        )
      )
      (i32.const -1)
      (i32.lt_u
        (i32.and
          (get_local $0)
          (i32.const 255)
        )
        (i32.const 26)
      )
    )
  )
  (func $print_invalid_word (param $0 i32) (param $1 i32)
    (local $2 i32)
    (i32.store offset=4
      (i32.const 0)
      (tee_local $2
        (i32.sub
          (i32.load offset=4
            (i32.const 0)
          )
          (i32.const 16)
        )
      )
    )
    (i32.store
      (get_local $2)
      (get_local $0)
    )
    (drop
      (call $printf
        (i32.const 16)
        (get_local $2)
      )
    )
    (drop
      (call $printf
        (i32.const 32)
        (i32.const 0)
      )
    )
    (block $label$0
      (br_if $label$0
        (i32.lt_s
          (get_local $1)
          (i32.const 1)
        )
      )
      (loop $label$1
        (drop
          (call $putchar
            (i32.const 32)
          )
        )
        (br_if $label$1
          (tee_local $1
            (i32.add
              (get_local $1)
              (i32.const -1)
            )
          )
        )
      )
    )
    (drop
      (call $puts
        (i32.const 400)
      )
    )
    (i32.store offset=4
      (i32.const 0)
      (i32.add
        (get_local $2)
        (i32.const 16)
      )
    )
  )
  (func $trie_insert (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
    (local $3 i32)
    (local $4 i32)
    (local $5 i32)
    (local $6 i32)
    (i32.store offset=4
      (i32.const 0)
      (tee_local $6
        (i32.sub
          (i32.load offset=4
            (i32.const 0)
          )
          (i32.const 32)
        )
      )
    )
    (block $label$0
      (block $label$1
        (block $label$2
          (br_if $label$2
            (i32.eqz
              (tee_local $5
                (i32.load8_u
                  (get_local $1)
                )
              )
            )
          )
          (set_local $3
            (i32.const 0)
          )
          (loop $label$3
            (set_local $4
              (i32.shr_s
                (i32.shl
                  (get_local $5)
                  (i32.const 24)
                )
                (i32.const 24)
              )
            )
            (block $label$4
              (block $label$5
                (br_if $label$5
                  (i32.gt_u
                    (i32.and
                      (i32.add
                        (get_local $5)
                        (i32.const -65)
                      )
                      (i32.const 255)
                    )
                    (i32.const 25)
                  )
                )
                (br_if $label$4
                  (i32.ne
                    (tee_local $5
                      (i32.add
                        (get_local $4)
                        (i32.const -39)
                      )
                    )
                    (i32.const -1)
                  )
                )
                (br $label$1)
              )
              (br_if $label$1
                (i32.gt_u
                  (i32.and
                    (i32.add
                      (get_local $5)
                      (i32.const -97)
                    )
                    (i32.const 255)
                  )
                  (i32.const 25)
                )
              )
              (br_if $label$1
                (i32.eq
                  (tee_local $5
                    (i32.add
                      (get_local $4)
                      (i32.const -97)
                    )
                  )
                  (i32.const -1)
                )
              )
            )
            (block $label$6
              (br_if $label$6
                (tee_local $0
                  (i32.load
                    (tee_local $5
                      (i32.add
                        (i32.add
                          (get_local $0)
                          (i32.shl
                            (get_local $5)
                            (i32.const 2)
                          )
                        )
                        (i32.const 4)
                      )
                    )
                  )
                )
              )
              (i32.store
                (get_local $5)
                (tee_local $0
                  (call $malloc
                    (i32.const 212)
                  )
                )
              )
            )
            (br_if $label$2
              (i32.ge_u
                (tee_local $4
                  (i32.add
                    (get_local $3)
                    (i32.const 1)
                  )
                )
                (call $strlen
                  (get_local $1)
                )
              )
            )
            (set_local $5
              (i32.load8_u
                (i32.add
                  (i32.add
                    (get_local $1)
                    (get_local $3)
                  )
                  (i32.const 1)
                )
              )
            )
            (set_local $3
              (get_local $4)
            )
            (br $label$3)
          )
        )
        (set_local $1
          (i32.const 1)
        )
        (i32.store
          (get_local $0)
          (tee_local $5
            (call $malloc
              (i32.add
                (tee_local $3
                  (call $strlen
                    (get_local $2)
                  )
                )
                (i32.const 1)
              )
            )
          )
        )
        (drop
          (call $strncpy
            (get_local $5)
            (get_local $2)
            (get_local $3)
          )
        )
        (br $label$0)
      )
      (drop
        (call $puts
          (i32.const 416)
        )
      )
      (i32.store offset=16
        (get_local $6)
        (get_local $1)
      )
      (drop
        (call $printf
          (i32.const 16)
          (i32.add
            (get_local $6)
            (i32.const 16)
          )
        )
      )
      (set_local $1
        (i32.const 0)
      )
      (drop
        (call $printf
          (i32.const 32)
          (i32.const 0)
        )
      )
      (block $label$7
        (br_if $label$7
          (i32.lt_s
            (get_local $3)
            (i32.const 1)
          )
        )
        (set_local $5
          (i32.const 0)
        )
        (loop $label$8
          (drop
            (call $putchar
              (i32.const 32)
            )
          )
          (br_if $label$8
            (i32.ne
              (tee_local $5
                (i32.add
                  (get_local $5)
                  (i32.const 1)
                )
              )
              (get_local $3)
            )
          )
        )
      )
      (drop
        (call $puts
          (i32.const 400)
        )
      )
      (i32.store
        (get_local $6)
        (get_local $2)
      )
      (drop
        (call $printf
          (i32.const 48)
          (get_local $6)
        )
      )
    )
    (i32.store offset=4
      (i32.const 0)
      (i32.add
        (get_local $6)
        (i32.const 32)
      )
    )
    (get_local $1)
  )
  (func $trie_get (param $0 i32) (param $1 i32) (result i32)
    (local $2 i32)
    (local $3 i32)
    (local $4 i32)
    (block $label$0
      (block $label$1
        (block $label$2
          (br_if $label$2
            (i32.eqz
              (tee_local $4
                (i32.load8_u
                  (get_local $1)
                )
              )
            )
          )
          (set_local $2
            (i32.const 1)
          )
          (loop $label$3
            (set_local $3
              (i32.shr_s
                (i32.shl
                  (get_local $4)
                  (i32.const 24)
                )
                (i32.const 24)
              )
            )
            (block $label$4
              (block $label$5
                (br_if $label$5
                  (i32.gt_u
                    (i32.and
                      (i32.add
                        (get_local $4)
                        (i32.const -65)
                      )
                      (i32.const 255)
                    )
                    (i32.const 25)
                  )
                )
                (set_local $4
                  (i32.add
                    (get_local $3)
                    (i32.const -39)
                  )
                )
                (br $label$4)
              )
              (br_if $label$0
                (i32.gt_u
                  (i32.and
                    (i32.add
                      (get_local $4)
                      (i32.const -97)
                    )
                    (i32.const 255)
                  )
                  (i32.const 25)
                )
              )
              (set_local $4
                (i32.add
                  (get_local $3)
                  (i32.const -97)
                )
              )
            )
            (set_local $3
              (i32.const 0)
            )
            (br_if $label$1
              (i32.eq
                (get_local $4)
                (i32.const -1)
              )
            )
            (br_if $label$1
              (i32.eqz
                (tee_local $0
                  (i32.load
                    (i32.add
                      (i32.add
                        (get_local $0)
                        (i32.shl
                          (get_local $4)
                          (i32.const 2)
                        )
                      )
                      (i32.const 4)
                    )
                  )
                )
              )
            )
            (br_if $label$2
              (i32.ge_u
                (get_local $2)
                (call $strlen
                  (get_local $1)
                )
              )
            )
            (set_local $4
              (i32.load8_u
                (i32.add
                  (get_local $1)
                  (get_local $2)
                )
              )
            )
            (set_local $2
              (i32.add
                (get_local $2)
                (i32.const 1)
              )
            )
            (br $label$3)
          )
        )
        (set_local $3
          (i32.load
            (get_local $0)
          )
        )
      )
      (return
        (get_local $3)
      )
    )
    (i32.const 0)
  )
  (func $dictionary_initialise
    (drop
      (call $memset
        (i32.const 72)
        (i32.const 0)
        (i32.const 212)
      )
    )
  )
  (func $dictionary_read_from_file (param $0 i32) (result i32)
    (local $1 i32)
    (local $2 i32)
    (local $3 i32)
    (i32.store offset=4
      (i32.const 0)
      (tee_local $3
        (i32.sub
          (i32.load offset=4
            (i32.const 0)
          )
          (i32.const 320)
        )
      )
    )
    (block $label$0
      (block $label$1
        (block $label$2
          (block $label$3
            (br_if $label$3
              (i32.eqz
                (tee_local $1
                  (call $fopen
                    (get_local $0)
                    (i32.const 288)
                  )
                )
              )
            )
            (i32.store offset=52
              (get_local $3)
              (i32.add
                (get_local $3)
                (i32.const 64)
              )
            )
            (i32.store offset=48
              (get_local $3)
              (i32.add
                (get_local $3)
                (i32.const 272)
              )
            )
            (set_local $2
              (i32.const 0)
            )
            (block $label$4
              (br_if $label$4
                (i32.lt_s
                  (call $fscanf
                    (get_local $1)
                    (i32.const 336)
                    (i32.add
                      (get_local $3)
                      (i32.const 48)
                    )
                  )
                  (i32.const 2)
                )
              )
              (set_local $2
                (i32.const 0)
              )
              (loop $label$5
                (br_if $label$2
                  (i32.eqz
                    (call $trie_insert
                      (i32.const 72)
                      (i32.add
                        (get_local $3)
                        (i32.const 272)
                      )
                      (i32.add
                        (get_local $3)
                        (i32.const 64)
                      )
                    )
                  )
                )
                (set_local $2
                  (i32.add
                    (get_local $2)
                    (i32.const 1)
                  )
                )
                (i32.store offset=36
                  (get_local $3)
                  (i32.add
                    (get_local $3)
                    (i32.const 64)
                  )
                )
                (i32.store offset=32
                  (get_local $3)
                  (i32.add
                    (get_local $3)
                    (i32.const 272)
                  )
                )
                (br_if $label$5
                  (i32.gt_s
                    (call $fscanf
                      (get_local $1)
                      (i32.const 336)
                      (i32.add
                        (get_local $3)
                        (i32.const 32)
                      )
                    )
                    (i32.const 1)
                  )
                )
              )
            )
            (drop
              (call $fclose
                (get_local $1)
              )
            )
            (i32.store offset=20
              (get_local $3)
              (get_local $2)
            )
            (i32.store offset=16
              (get_local $3)
              (get_local $0)
            )
            (drop
              (call $printf
                (i32.const 352)
                (i32.add
                  (get_local $3)
                  (i32.const 16)
                )
              )
            )
            (set_local $2
              (i32.const 1)
            )
            (br $label$0)
          )
          (i32.store
            (get_local $3)
            (get_local $0)
          )
          (drop
            (call $printf
              (i32.const 304)
              (get_local $3)
            )
          )
          (br $label$1)
        )
        (drop
          (call $fclose
            (get_local $1)
          )
        )
      )
      (set_local $2
        (i32.const 0)
      )
    )
    (i32.store offset=4
      (i32.const 0)
      (i32.add
        (get_local $3)
        (i32.const 320)
      )
    )
    (get_local $2)
  )
  (func $dictionary_lookup (param $0 i32) (param $1 i32) (result i32)
    (local $2 i32)
    (local $3 i32)
    (local $4 i32)
    (local $5 i32)
    (local $6 i32)
    (local $7 i32)
    (i32.store offset=4
      (i32.const 0)
      (tee_local $7
        (i32.sub
          (i32.load offset=4
            (i32.const 0)
          )
          (i32.const 16)
        )
      )
    )
    (set_local $3
      (i32.const 72)
    )
    (block $label$0
      (block $label$1
        (block $label$2
          (block $label$3
            (br_if $label$3
              (i32.eqz
                (tee_local $6
                  (i32.load8_u
                    (get_local $0)
                  )
                )
              )
            )
            (set_local $5
              (i32.const 0)
            )
            (set_local $4
              (get_local $6)
            )
            (loop $label$4
              (set_local $2
                (i32.shr_s
                  (i32.shl
                    (get_local $4)
                    (i32.const 24)
                  )
                  (i32.const 24)
                )
              )
              (block $label$5
                (block $label$6
                  (br_if $label$6
                    (i32.gt_u
                      (i32.and
                        (i32.add
                          (get_local $4)
                          (i32.const -65)
                        )
                        (i32.const 255)
                      )
                      (i32.const 25)
                    )
                  )
                  (br_if $label$5
                    (i32.ne
                      (i32.add
                        (get_local $2)
                        (i32.const -39)
                      )
                      (i32.const -1)
                    )
                  )
                  (br $label$2)
                )
                (br_if $label$2
                  (i32.gt_u
                    (i32.and
                      (i32.add
                        (get_local $4)
                        (i32.const -97)
                      )
                      (i32.const 255)
                    )
                    (i32.const 25)
                  )
                )
                (br_if $label$2
                  (i32.eq
                    (i32.add
                      (get_local $2)
                      (i32.const -97)
                    )
                    (i32.const -1)
                  )
                )
              )
              (block $label$7
                (br_if $label$7
                  (i32.ge_u
                    (tee_local $2
                      (i32.add
                        (get_local $5)
                        (i32.const 1)
                      )
                    )
                    (call $strlen
                      (get_local $0)
                    )
                  )
                )
                (set_local $4
                  (i32.load8_u
                    (i32.add
                      (i32.add
                        (get_local $0)
                        (get_local $5)
                      )
                      (i32.const 1)
                    )
                  )
                )
                (set_local $5
                  (get_local $2)
                )
                (br $label$4)
              )
            )
            (br_if $label$3
              (i32.eqz
                (get_local $6)
              )
            )
            (set_local $3
              (i32.const 72)
            )
            (set_local $5
              (i32.const 1)
            )
            (loop $label$8
              (set_local $4
                (i32.shr_s
                  (i32.shl
                    (get_local $6)
                    (i32.const 24)
                  )
                  (i32.const 24)
                )
              )
              (block $label$9
                (block $label$10
                  (br_if $label$10
                    (i32.gt_u
                      (i32.and
                        (i32.add
                          (get_local $6)
                          (i32.const -65)
                        )
                        (i32.const 255)
                      )
                      (i32.const 25)
                    )
                  )
                  (set_local $4
                    (i32.add
                      (get_local $4)
                      (i32.const -39)
                    )
                  )
                  (br $label$9)
                )
                (br_if $label$1
                  (i32.gt_u
                    (i32.and
                      (i32.add
                        (get_local $6)
                        (i32.const -97)
                      )
                      (i32.const 255)
                    )
                    (i32.const 25)
                  )
                )
                (set_local $4
                  (i32.add
                    (get_local $4)
                    (i32.const -97)
                  )
                )
              )
              (set_local $2
                (i32.const 0)
              )
              (br_if $label$0
                (i32.eq
                  (get_local $4)
                  (i32.const -1)
                )
              )
              (br_if $label$0
                (i32.eqz
                  (tee_local $3
                    (i32.load
                      (i32.add
                        (i32.add
                          (get_local $3)
                          (i32.shl
                            (get_local $4)
                            (i32.const 2)
                          )
                        )
                        (i32.const 4)
                      )
                    )
                  )
                )
              )
              (br_if $label$3
                (i32.ge_u
                  (get_local $5)
                  (call $strlen
                    (get_local $0)
                  )
                )
              )
              (set_local $6
                (i32.load8_u
                  (i32.add
                    (get_local $0)
                    (get_local $5)
                  )
                )
              )
              (set_local $5
                (i32.add
                  (get_local $5)
                  (i32.const 1)
                )
              )
              (br $label$8)
            )
          )
          (br_if $label$1
            (i32.eqz
              (tee_local $5
                (i32.load
                  (get_local $3)
                )
              )
            )
          )
          (drop
            (call $strcpy
              (get_local $1)
              (get_local $5)
            )
          )
          (set_local $2
            (i32.const 1)
          )
          (br $label$0)
        )
        (drop
          (call $puts
            (i32.const 480)
          )
        )
        (i32.store
          (get_local $7)
          (get_local $0)
        )
        (drop
          (call $printf
            (i32.const 16)
            (get_local $7)
          )
        )
        (set_local $2
          (i32.const 0)
        )
        (drop
          (call $printf
            (i32.const 32)
            (i32.const 0)
          )
        )
        (block $label$11
          (br_if $label$11
            (i32.lt_s
              (get_local $5)
              (i32.const 1)
            )
          )
          (set_local $4
            (i32.const 0)
          )
          (loop $label$12
            (drop
              (call $putchar
                (i32.const 32)
              )
            )
            (br_if $label$12
              (i32.ne
                (tee_local $4
                  (i32.add
                    (get_local $4)
                    (i32.const 1)
                  )
                )
                (get_local $5)
              )
            )
          )
        )
        (drop
          (call $puts
            (i32.const 400)
          )
        )
        (br $label$0)
      )
      (set_local $2
        (i32.const 0)
      )
    )
    (i32.store offset=4
      (i32.const 0)
      (i32.add
        (get_local $7)
        (i32.const 16)
      )
    )
    (get_local $2)
  )
)
