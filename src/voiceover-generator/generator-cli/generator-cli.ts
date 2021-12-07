import { CliArguments } from './cli-arguments';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as packageJson from '../../../package.json';

export class GeneratorCli {

    parse(commandLineArgs: string[]): CliArguments {
        return yargs(hideBin(commandLineArgs))
            .usage([
                'Usage: $0',
                '--input "<filename>"',
                '--pattern "<pattern>"',
                '--dictionary "<filename>"',
                '--count-per-number <count-per-number>',
                '[--output "<filename>"]'
            ].join(' '))
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
            .option('countPerNumber', {
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
            .option('quirk', {
                alias: 'q',
                type: 'boolean',
                description: 'Quirk mode when the same number can include distinct values of the same dictionary key',
                default: false
            })
            .version(packageJson.version)
            .demandOption(['input', 'pattern', 'dictionary', 'countPerNumber'])
            .showHelpOnFail(true)
            .parse() as CliArguments;
    }
}