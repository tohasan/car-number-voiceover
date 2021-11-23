import { GeneratorCli } from './generator-cli';

describe('GeneratorCli', () => {
    let cli: GeneratorCli;

    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        cli = new GeneratorCli();
    });

    describe('#parse', () => {
        const pattern = '[L, D, D, D, L, L, S, R]';
        const definitions = [
            'L=[А,В,Е,К,М,Н,О,Р,С,Т,У,Х]',
            'D=[0-9]',
            'S=[ ]',
            'R=[78,79]'
        ];
        const requiredArgs = [
            ...baseCmdArgs,
            '--pattern', pattern,
            '--definitions', ...definitions
        ];

        it('should parse required arguments: pattern and definitions', () => {
            const args = cli.parse(requiredArgs);

            expect(args.pattern).toEqual(pattern);
            expect(args.definitions).toEqual(definitions);
        });

        it('should set a default value for the output filename', () => {
            const args = cli.parse(requiredArgs);
            expect(args.output).toEqual('./output/numbers.txt');
        });

        it('should parse a provided output filename', () => {
            const outputFile = `${__dirname}/output/numbers.txt`;
            const cmdArgs = [
                ...requiredArgs,
                '--output', outputFile
            ];

            const args = cli.parse(cmdArgs);

            expect(args.output).toEqual(outputFile);
        });

        it('should not set any default value for generating number of car numbers', () => {
            const args = cli.parse(requiredArgs);
            expect(args.count).toBeUndefined();
        });

        it('should parse a provided number of car numbers required to be generated', () => {
            const cmdArgs = [
                ...requiredArgs,
                '--count', '500'
            ];

            const args = cli.parse(cmdArgs);

            expect(args.count).toEqual(500);
        });

        it('should set a default value for shuffle as disabled', () => {
            const args = cli.parse(requiredArgs);
            expect(args.shuffle).toEqual(false);
        });

        it('should parse the shuffle flag if it specified', () => {
            const cmdArgs = [
                ...requiredArgs,
                '--shuffle'
            ];

            const args = cli.parse(cmdArgs);

            expect(args.shuffle).toEqual(true);
        });
    });
});