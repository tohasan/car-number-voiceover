import { CliArguments } from '../entities/cli-arguments';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as packageJson from '../../../package.json';

export class GeneratorCli {

    parse(commandLineArgs: string[]): CliArguments {
        return yargs(hideBin(commandLineArgs))
            .usage('Usage: $0 --pattern "<pattern>" --definitions "<def 1>" ["<def i>"] [--output "<filename>"]')
            .epilogue('Copyright (c) tohasan, Car Number Generator, 2021. All Rights Reserved.')
            .option('pattern', {
                alias: 'p',
                type: 'string',
                description: 'The pattern of a car number'
            })
            .option('definitions', {
                alias: 'd',
                type: 'array',
                description: 'The list of definitions used in the pattern'
            })
            .option('output', {
                alias: 'o',
                type: 'string',
                description: 'Define a file to export the car numbers',
                default: './output/numbers.txt'
            })
            .option('count', {
                alias: 'c',
                type: 'number',
                description: 'A number of car numbers you want to generate'
            })
            .version(packageJson.version)
            .demandOption(['pattern', 'definitions'])
            .showHelpOnFail(true)
            .parse() as CliArguments;
    }
}