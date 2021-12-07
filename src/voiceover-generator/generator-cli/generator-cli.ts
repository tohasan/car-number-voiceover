import { CliArguments } from './cli-arguments';
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
            .option('pattern', {
                alias: 'p',
                type: 'string',
                description: 'A pattern of facets'
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
            .option('statistics', {
                alias: 's',
                type: 'boolean',
                description: 'Calculate some statistics about utilization of the dictionary and generated voiceovers',
                default: false
            })
            .version(packageJson.version)
            .demandOption(['input', 'pattern', 'dictionary'])
            .showHelpOnFail(true)
            .parse() as CliArguments;
    }
}