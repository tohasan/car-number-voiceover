# Car Number Voiceover

The tool generates a set of car numbers and translates them into a
variety of pronunciations.

## Prerequisites

* nodejs v16+
* yarn v1.22+
* installed dependencies: `yarn`

## Usage

### Car Number Generator

```shell
$ yarn generate:numbers --pattern "[L, D]" --definitions "L=[A, B]" "D=[0-3]"
```

You will get the result file in the `./output/numbers.txt`. You can
specify a desired filename if you want.

You can use more complicated patterns. For instance:

```shell
$ yarn generate:numbers \
    --pattern "[L, D, D, D, L, L, S, R]" \
    --definitions "L=[А,В,Е,К,М,Н,О,Р,С,Т,У,Х]" "D=[0-9]" "S=[ ]" "R=[47,60,78,79]" \
    --count 500 \
    --shuffle
```

A single line version of the command if multiline does not work for
you:

```shell
$ yarn generate:numbers --pattern "[L, D, D, D, L, L, S, R]" --definitions "L=[А,В,Е,К,М,Н,О,Р,С,Т,У,Х]" "D=[0-9]" "S=[ ]" "R=[47,60,78,177]" --count 500 --shuffle
```

### Voiceover Generator

A multiline version of the command:

```shell
$yarn generate:voiceover \
    --input assets/voiceover/example/numbers.txt \
    --pattern [P,N,N,N,S,S,D,R,R,R]\ 
    --dictionary assets/voiceover/example/voiceover.dictionary.csv \
    --output output/voiceovers.csv \
    --count-per-number 3 \
    --statistics \
    --quirk
```

A single line version of the command if multiline does not work for
you:

```shell
$yarn generate:voiceover --input assets/voiceover/example/numbers.txt --pattern [P,N,N,N,S,S,D,R,R,R] --dictionary assets/voiceover/example/voiceover.dictionary.csv --output output/voiceovers.csv --count-per-number 3 --statistics --quirk
```

If you do not specify the output file, by default you should find the
result in `./output/voiceovers.csv`.