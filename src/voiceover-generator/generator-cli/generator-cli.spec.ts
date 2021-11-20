import { GeneratorCli } from './generator-cli';

describe('GeneratorCli', () => {
    let cli: GeneratorCli;

    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        cli = new GeneratorCli();
    });

    describe('#parse', () => {
        const inputFile = './input/numbers.txt';
        const dictionaryFile = './input/voiceover.dictionary.csv';
        const outputFile = './output/voiceovers.txt';
        const requiredArgs = [
            ...baseCmdArgs,
            '--dictionary', dictionaryFile,
            '--input', inputFile
        ];

        it('should parse the input filename', () => {
            const options = cli.parse(requiredArgs);
            expect(options.input).toEqual(inputFile);
        });

        it('should parse the dictionary filename', () => {
            const options = cli.parse(requiredArgs);
            expect(options.dictionary).toEqual(dictionaryFile);
        });

        it('should parse the output filename', () => {
            const args = [
                ...requiredArgs,
                '--output', outputFile
            ];

            const options = cli.parse(args);

            expect(options.output).toEqual(outputFile);
        });

        it('should set default value for the output filename', () => {
            const options = cli.parse(requiredArgs);
            expect(options.output).toEqual('./output/voiceovers.csv');
        });

        it('should not set any default value for number of voiceovers per car number', () => {
            const args = cli.parse(requiredArgs);
            expect(args.countPerNumber).toBeUndefined();
        });

        it('should parse a provided number of voiceovers per car number', () => {
            const cmdArgs = [
                ...requiredArgs,
                '--count-per-number', '3'
            ];

            const args = cli.parse(cmdArgs);

            expect(args.countPerNumber).toEqual(3);
        });
    });
});