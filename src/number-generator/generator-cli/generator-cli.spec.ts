import { GeneratorCli } from './generator-cli';

describe('GeneratorCli', () => {
    let cli: GeneratorCli;

    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        cli = new GeneratorCli();
    });

    describe('#run', () => {
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

        it('should parse the output filename', () => {
            const outputFile = `${__dirname}/output/numbers.txt`;
            const cmdArgs = [
                ...requiredArgs,
                '--output', outputFile
            ];

            const args = cli.parse(cmdArgs);

            expect(args.output).toEqual(outputFile);
        });
    });
});