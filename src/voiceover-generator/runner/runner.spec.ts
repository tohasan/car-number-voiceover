import { Runner } from './runner';
import * as fs from 'fs';
import { dependencies } from '../../common/utils/specs/dependencies';
import { FileReader } from '../file-reader/file-reader';

describe('Runner', () => {
    let runner: Runner;

    const baseDir = __dirname;
    const assetsDir = `${baseDir}/spec-assets`;
    const outputDir = `${baseDir}/output`;
    const toolCmdArgs = ['ts-node', 'src/index.ts'];

    const { output } = dependencies;

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {
        const defaultDictionaryFile = `${assetsDir}/default/voiceover.dictionary.csv`;
        const outputFile = `${outputDir}/voiceovers.csv`;
        const countPerNumber = 3;
        const baseArgs = [
            ...toolCmdArgs,
            '--dictionary', defaultDictionaryFile,
            '--output', outputFile,
            '--count-per-number', String(countPerNumber)
        ];

        // car number: A002BB 78
        const defaultInputFile = `${assetsDir}/default/numbers.txt`;
        const generalCaseArgs = [
            ...baseArgs,
            '--input', defaultInputFile
        ];

        it('should translate car numbers into voiceovers', () => {
            runner.run(generalCaseArgs);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'А002ВВ 78;а два нуля два два вэ регион семьдесят восемь',
                'А002ВВ 78;Александр два ноля двойка две вэ пробел семь восемь',
                'А002ВВ 78;Анна дубль ноль два дубль вэ регион семерка восьмерка'
            ].join('\n'));
        });

        it('should be able to generate voiceovers for 500 car numbers and 1k+ dictionary less than 1 second', () => {
            const carNumbersCount = 500;
            const inputDir = `${assetsDir}/500-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.1k.csv`;
            const args = [
                ...toolCmdArgs,
                '--input', inputFile,
                '--dictionary', dictionaryFile,
                '--output', outputFile,
                '--count-per-number', String(countPerNumber)
            ];

            runner.run(args);

            const fileReader = new FileReader();
            const voiceovers = fileReader.read(outputFile);
            const [, time] = output.getLogs().match(/Time spent: (\d+) ms/)!;
            const expectedTimeLimitInMilliseconds = 1000;
            expect(voiceovers.length).toEqual(carNumbersCount * countPerNumber);
            expect(Number(time)).toBeLessThan(expectedTimeLimitInMilliseconds);
        });

        it('should get voiceovers for the european car numbers', () => {
            const inputDir = `${assetsDir}/the-european-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
            const args = [
                ...toolCmdArgs,
                '--dictionary', dictionaryFile,
                '--input', inputFile,
                '--output', outputFile,
                '--count-per-number', String(countPerNumber)
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'LV NX-1133;Латвия эн экс дефис одинадцать тридцать три',
                'LV NX-1133;страна эл ви пробел нэ икс дефис две единицы две тройки',
                'LV NX-1133;л вэ н ха дубль один дубль три',
                'LТ EJN:111;страна Литва и джей эн двоеточие сто одинадцать',
                'LТ EJN:111;латинская эл ти пробел е джи нэ двоеточие три единицы',
                'LТ EJN:111;страна английская эл тэ латинская е джей н триплет единиц',
                'EST 007 QOJ;Эстония два нуля семь пробел кью оу джи',
                'EST 007 QOJ;страна английская е эс т пробел два ноля семерка пробел ку о джей',
                'EST 007 QOJ;и сэ ти дубль нуль семь кью оу джи',
                'FIN EGT-018;страна Финляндия е джи тэ дефис ноль восемнадцать',
                'FIN EGT-018;эф ай латинская эн пробел латинская е гэ т дефис нуль один восемь',
                'FIN EGT-018;страна фэ и с точкой английская эн английская е латинская гэ ти ноль восемнадцать'
            ].join('\n'));
        });

        it('should print statistics if a user sets the special flag', () => {
            const extendedArgs = [...generalCaseArgs, '--statistics'];
            runner.run(extendedArgs);
            expect(output.getLogs()).toContain('Statistics');
        });

        it('should not print statistics by default', () => {
            runner.run(generalCaseArgs);
            expect(output.getLogs()).not.toContain('Statistics');
        });
    });

    afterAll(() => {
        fs.rmSync(outputDir, { recursive: true });
    });
});