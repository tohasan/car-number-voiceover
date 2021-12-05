import { Runner } from './runner';
import * as fs from 'fs';
import { dependencies } from '../../common/utils/specs/dependencies';

describe('Runner', () => {
    let runner: Runner;

    const baseDir = __dirname;
    const defaultInputDir = `${baseDir}/spec-assets`;
    const outputDir = `${baseDir}/output`;
    const toolCmdArgs = ['ts-node', 'src/index.ts'];

    const { output } = dependencies;

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {
        const defaultDictionaryFile = `${defaultInputDir}/default/voiceover.dictionary.csv`;
        const outputFile = `${outputDir}/voiceovers.csv`;
        const baseArgs = [
            ...toolCmdArgs,
            '--dictionary', defaultDictionaryFile,
            '--output', outputFile,
            '--count-per-number', '3'
        ];

        // car number: A002BB 78
        const defaultInputFile = `${defaultInputDir}/default/numbers.txt`;
        const generalCaseArgs = [
            ...baseArgs,
            '--input', defaultInputFile
        ];

        it('should translate car numbers into voiceovers', () => {
            runner.run(generalCaseArgs);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'А002ВВ 78;а ноль ноль два вэ вэ регион семь восемь',
                'А002ВВ 78;а нуль нуль двойка в в регион семерка восьмерка',
                'А002ВВ 78;а ноль ноль два вэ вэ регион семерка восемь'
            ].join('\n'));
        });

        it.skip('should be able to generate voiceovers for 500 car numbers less than 1 second', () => {
            const inputFile = `${defaultInputDir}/500-car-numbers/numbers.txt`;
            const args = [
                ...baseArgs,
                '--input', inputFile
            ];

            runner.run(args);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            const [, time] = output.getLogs().match(/Time spent: (\d+) ms/)!;
            expect(voiceovers.length).toEqual(500 * 3);
            expect(Number(time)).toBeLessThan(1000);
        });

        it('should get voiceovers for the european car numbers', () => {
            const inputDir = `${defaultInputDir}/the-european-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const args = [
                ...toolCmdArgs,
                '--dictionary', defaultDictionaryFile,
                '--input', inputFile,
                '--output', outputFile,
                '--count-per-number', '3'
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