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
                '--output', outputFile
            ];

            runner.run(args);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toContain('A002BB 78;а два ноля два дубль вэ семьдесят восьмой регион');
        });
    });

    afterAll(() => {
        fs.rmdirSync(outputDir, { recursive: true });
    });
});