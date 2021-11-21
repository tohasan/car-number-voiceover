import { Runner } from './runner';
import * as fs from 'fs';
import { dependencies } from '../../common/utils/specs/dependencies';

describe('Runner', () => {
    let runner: Runner;

    const baseDir = __dirname;
    const inputDir = `${baseDir}/spec-assets`;
    const outputDir = `${baseDir}/output`;
    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    const { output } = dependencies;

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {
        // car number: A002BB 78
        const inputFile = `${inputDir}/numbers.txt`;
        const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
        const outputFile = `${outputDir}/voiceovers.csv`;
        const args = [
            ...baseCmdArgs,
            '--dictionary', dictionaryFile,
            '--input', inputFile,
            '--output', outputFile,
            '--count-per-number', '3'
        ];

        it('should translate car numbers into voiceovers', () => {
            runner.run(args);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'А002ВВ 78;а ноль ноль два вэ вэ регион семь восемь',
                'А002ВВ 78;а нуль нуль двойка в в регион семерка восьмерка',
                'А002ВВ 78;а ноль ноль два вэ вэ регион семерка восемь'
            ].join('\n'));
        });

        it('should print statistics if a user sets the special flag', () => {
            const extendedArgs = [...args, '--statistics'];
            runner.run(extendedArgs);
            expect(output.getLogs()).toContain('Statistics');
        });

        it('should not print statistics by default', () => {
            runner.run(args);
            expect(output.getLogs()).not.toContain('Statistics');
        });
    });

    afterAll(() => {
        fs.rmSync(outputDir, { recursive: true });
    });
});