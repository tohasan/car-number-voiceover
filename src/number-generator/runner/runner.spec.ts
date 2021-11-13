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
                'L=[А,В,Е,К,М,Н,О,Р,С,Т,У,Х]',
                'D=[0-9]',
                'S=[ ]',
                'R=[78,79]'
            ];
            const args = [
                ...baseCmdArgs,
                '--pattern', pattern,
                '--definitions', ...definitions,
                '--output', outputFile
            ];

            runner.run(args);

            const numbers = fs.readFileSync(outputFile, 'utf8');
            expect(numbers).toContain('О124НМ 79');
        });
    });

    afterAll(() => {
        fs.rmdirSync(outputDir, { recursive: true });
    });
});