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
    });
});