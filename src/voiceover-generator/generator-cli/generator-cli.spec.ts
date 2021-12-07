import { GeneratorCli } from './generator-cli';

describe('GeneratorCli', () => {
    let cli: GeneratorCli;

    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        cli = new GeneratorCli();
    });

    describe('#parse', () => {
        const inputFile = './input/numbers.txt';
        const pattern = '[L1, D, D, D, L2, L2, S, R, R, R]';
        const countPerNumber = 3;
        const dictionaryFile = './input/voiceover.dictionary.csv';
        const outputFile = './output/voiceovers.txt';
        const requiredArgs = [
            ...baseCmdArgs,
            '--dictionary', dictionaryFile,
            '--input', inputFile,
            '--pattern', pattern,
            '--count-per-number', String(countPerNumber)
        ];

        it('should parse the input filename', () => {
            const options = cli.parse(requiredArgs);
            expect(options.input).toEqual(inputFile);
        });

        it('should parse the pattern parameter', () => {
            const options = cli.parse(requiredArgs);
            expect(options.pattern).toEqual(pattern);
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

        it('should parse a provided number of voiceovers per car number', () => {
            const args = cli.parse(requiredArgs);
            expect(args.countPerNumber).toEqual(3);
        });

        it('should not use statistics by default', () => {
            const args = cli.parse(requiredArgs);
            expect(args.statistics).toEqual(false);
        });

        it('should parse the statistics flag', () => {
            const cmdArgs = [
                ...requiredArgs,
                '--statistics'
            ];

            const args = cli.parse(cmdArgs);

            expect(args.statistics).toEqual(true);
        });

        it('should not activate the quirk mode by default', () => {
            const args = cli.parse(requiredArgs);
            expect(args.quirk).toEqual(false);
        });

        it('should parse the quirk flag', () => {
            const cmdArgs = [
                ...requiredArgs,
                '--quirk'
            ];

            const args = cli.parse(cmdArgs);

            expect(args.quirk).toEqual(true);
        });
    });
});