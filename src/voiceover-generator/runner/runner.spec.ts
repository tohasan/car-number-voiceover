import { Runner } from './runner';
import * as fs from 'fs';

describe('Runner', () => {
    let runner: Runner;

    const baseDir = __dirname;
    const inputDir = `${baseDir}/spec-assets`;
    const outputDir = `${baseDir}/output`;
    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {

        it('should translate car numbers into voiceovers', () => {
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

            runner.run(args);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'А002ВВ 78;а ноль ноль два вэ вэ регион семь восемь',
                'А002ВВ 78;а нуль нуль двойка в в регион семерка восьмерка',
                'А002ВВ 78;а ноль ноль два вэ вэ регион семьдесят восемь'
            ].join('\n'));
        });
    });

    afterAll(() => {
        fs.rmdirSync(outputDir, { recursive: true });
    });
});