import { Runner } from './runner';
import * as fs from 'fs';

describe('Runner', () => {
    let runner: Runner;

    const outputDir = `${__dirname}/output`;
    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {
        const outputFile = `${outputDir}/numbers.txt`;
        const pattern = '[L, D, D, D, L, L, S, R]';
        const definitions = [
            'L=[М,Н,О]',
            'D=[0-5]',
            'S=[ ]',
            'R=[78,79]'
        ];
        const args = [
            ...baseCmdArgs,
            '--pattern', pattern,
            '--definitions', ...definitions,
            '--output', outputFile,
            '--count', '3'
        ];

        it('should generate a set of numbers by a specified pattern of a number', () => {
            runner.run(args);

            const numbers = fs.readFileSync(outputFile, 'utf8');
            expect(numbers).toEqual([
                'М001ММ 78',
                'Н002МН 79',
                'О003МО 78'
            ].join('\n'));
        });

        it('should shuffle the result if the special option is set', () => {
            runner.run([...args, '--shuffle']);

            const numbers = fs.readFileSync(outputFile, 'utf8');
            expect(numbers).toEqual([
                'Н002МН 79',
                'О003МО 78',
                'М001ММ 78'
            ].join('\n'));
        });
    });

    afterAll(() => {
        fs.rmSync(outputDir, { recursive: true });
    });
});