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
            '--output', outputFile,
            '--count-per-number', String(countPerNumber)
        ];

        // car number: A002BB 78
        const defaultInputFile = `${assetsDir}/default/numbers.txt`;
        const generalCaseArgs = [
            ...baseArgs,
            '--input', defaultInputFile,
            '--dictionary', defaultDictionaryFile,
            '--pattern', '[P, N, N, N, S, S, E, R, R, R]'
        ];

        it('should translate car numbers into voiceovers', () => {
            const args = [
                ...generalCaseArgs,
                '--quirk'
            ];

            runner.run(args);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'Х002СХ 199;ха два нуля два эс хэ регион сто девяносто девять',
                'Х002СХ 199;х два ноля двойка сэ Харитон регион один девяносто девять',
                'Х002СХ 199;Харлампия дубль нуль два с Христофор регион единица две девятки',
                'М999ММ 47;эм девятьсот девяносто девять два эм регион сорок семь',
                'М999ММ 47;мэ три девятки две эм регион четыре семь',
                'М999ММ 47;м триплет девяток дубль эм регион четверка семерка',
                'Е003АЕ 99;е дубль ноль три а Евгений регион дубль девять',
                'Е003АЕ 99;Елена дуплет нулей тройка Александр Егор регион дуплет девяток',
                'Е003АЕ 99;е ноль нуль три Анна Евгений регион девять девятка'
            ].join('\n'));
        });

        it('should be able to generate voiceovers for 500 car numbers and 1k+ dictionary less than 1 second', () => {
            const carNumbersCount = 500;
            const inputDir = `${assetsDir}/500-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.1k.csv`;
            const args = [
                ...baseArgs,
                '--input', inputFile,
                '--dictionary', dictionaryFile,
                '--pattern', '[P, N, N, N, S, S, E, R, R, R]'
            ];

            runner.run(args);

            const fileReader = new FileReader();
            const voiceovers = fileReader.read(outputFile);
            const [, time] = output.getLogs().match(/Time spent: (\d+) ms/)!;
            const expectedTimeLimitInMilliseconds = 1000;
            expect(voiceovers.length).toEqual(carNumbersCount * countPerNumber);
            expect(Number(time)).toBeLessThan(expectedTimeLimitInMilliseconds);
        });

        it('should get voiceovers for latvian car numbers', () => {
            const inputDir = `${assetsDir}/latvian-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
            const args = [
                ...baseArgs,
                '--dictionary', dictionaryFile,
                '--input', inputFile,
                '--pattern', '[C, C, C, S, S, D, N, N, N, N]'
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'LV NX-1133;Латвия эн экс дефис тысяча сто тридцать три',
                'LV NX-1133;страна эл ви нэ икс дефис сто тринадцать три',
                'LV NX-1133;л вэ пробел н ха дефис один сто тридцать три'
            ].join('\n'));
        });

        it('should get voiceovers for lithuanian car numbers', () => {
            const inputDir = `${assetsDir}/lithuanian-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
            const args = [
                ...baseArgs,
                '--dictionary', dictionaryFile,
                '--input', inputFile,
                '--pattern', '[C, C, C, S, S, S, D, N, N, N]'
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'LT EJN:111;Литва и джей эн двоеточие сто одиннадцать',
                'LT EJN:111;латинская эл ти пробел е джи нэ двоеточие три единицы',
                'LT EJN:111;страна Литва латинская е джей н двоеточие триплет единиц'
            ].join('\n'));
        });

        it('should get voiceovers for estonian car numbers', () => {
            const inputDir = `${assetsDir}/estonian-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
            const args = [
                ...baseArgs,
                '--dictionary', dictionaryFile,
                '--input', inputFile,
                '--pattern', '[C, C, C, C, N, N, N, D, S, S, S]'
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'EST 007 QOJ;Эстония два нуля семь пробел кью оу джей',
                'EST 007 QOJ;страна английская е эс т пробел два ноля семерка пробел ку о джи',
                'EST 007 QOJ;и сэ ти дубль нуль семь пробел кью оу джей'
            ].join('\n'));
        });

        it('should get voiceovers for finnish car numbers', () => {
            const inputDir = `${assetsDir}/finnish-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const dictionaryFile = `${inputDir}/voiceover.dictionary.csv`;
            const args = [
                ...baseArgs,
                '--dictionary', dictionaryFile,
                '--input', inputFile,
                '--pattern', '[C, C, C, C, S, S, S, D, N, N, N]'
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'FIN EGT-018;страна Финляндия и джи ти дефис ноль восемнадцать',
                'FIN EGT-018;эф ай латинская эн пробел е гэ тэ дефис нуль один восемь',
                'FIN EGT-018;страна фэ и с точкой английская эн латинская е латинская гэ т дефис ноль единица восьмерка'
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