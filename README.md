# Car Number Voiceover

The tool generates a set of car numbers and translates them into a
variety of pronunciations.

## Prerequisites

* nodejs v16+
* yarn v1.22+

## Usage

### Car Number Generator

```shell
$ yarn
$ yarn generate:numbers --pattern "[L, D]" --definitions "L=[A, B]" "D=[0-3]"
```

You will get the result file in the `./output/numbers.txt`. You can
specify a desired filename if you want.