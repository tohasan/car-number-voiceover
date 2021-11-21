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

        it('should generate a set of numbers by a specified pattern of a number', () => {
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
                '--count', '2'
            ];

            runner.run(args);

            const numbers = fs.readFileSync(outputFile, 'utf8');
            expect(numbers).toEqual([
                'М001ММ 78',
                'Н002МН 79'
            ].join('\n'));
        });
    });

    afterAll(() => {
        fs.rmSync(outputDir, { recursive: true });
    });
});