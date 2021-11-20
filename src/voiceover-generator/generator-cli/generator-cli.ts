import { CliArguments } from '../entities/cli-arguments';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as packageJson from '../../../package.json';

export class GeneratorCli {

    parse(commandLineArgs: string[]): CliArguments {
        return yargs(hideBin(commandLineArgs))
            .usage('Usage: $0 --input "<filename>" --dictionary "<filename>" [--output "<filename>"]')
            .epilogue('Copyright (c) tohasan, Voiceover Generator, 2021. All Rights Reserved.')
            .option('input', {
                alias: 'i',
                type: 'string',
                description: 'An input file with car numbers'
            })
            .option('dictionary', {
                alias: 'd',
                type: 'string',
                description: 'A file with voiceover dictionary'
            })
            .option('output', {
                alias: 'o',
                type: 'string',
                description: 'A file to export generated voiceovers',
                default: './output/voiceovers.csv'
            })
            .option('count-per-number', {
                alias: 'cpn',
                type: 'number',
                description: 'A number of voiceovers you want to generate per car number'
            })
            .version(packageJson.version)
            .demandOption(['input', 'dictionary'])
            .showHelpOnFail(true)
            .parse() as CliArguments;
    }
}