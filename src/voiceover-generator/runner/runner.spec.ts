import { Runner } from './runner';
import * as fs from 'fs';
import { dependencies } from '../../common/utils/specs/dependencies';

describe('Runner', () => {
    let runner: Runner;

    const baseDir = __dirname;
    const defaultInputDir = `${baseDir}/spec-assets`;
    const outputDir = `${baseDir}/output`;
    const baseCmdArgs = ['ts-node', 'src/index.ts'];

    const { output } = dependencies;

    beforeEach(() => {
        runner = new Runner();
    });

    describe('#run', () => {
        // car number: A002BB 78
        const defaultInputFile = `${defaultInputDir}/numbers.txt`;
        const defaultDictionaryFile = `${defaultInputDir}/voiceover.dictionary.csv`;
        const outputFile = `${outputDir}/voiceovers.csv`;
        const generalArgs = [
            ...baseCmdArgs,
            '--dictionary', defaultDictionaryFile,
            '--input', defaultInputFile,
            '--output', outputFile,
            '--count-per-number', '3'
        ];

        it('should translate car numbers into voiceovers', () => {
            runner.run(generalArgs);

            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'А002ВВ 78;а ноль ноль два вэ вэ регион семь восемь',
                'А002ВВ 78;а нуль нуль двойка в в регион семерка восьмерка',
                'А002ВВ 78;а ноль ноль два вэ вэ регион семерка восемь'
            ].join('\n'));
        });

        it('should get voiceovers for the most long dictionary keys at first', () => {
            const inputDir = `${defaultInputDir}/the-most-long-dictionary-keys`;
            const inputFile = `${inputDir}/numbers.txt`;
            const args = [
                ...baseCmdArgs,
                '--dictionary', defaultDictionaryFile,
                '--input', inputFile,
                '--output', outputFile,
                '--count-per-number', '3'
            ];

            runner.run(args);
            const voiceovers = fs.readFileSync(outputFile, 'utf8');
            expect(voiceovers).toEqual([
                'Х002СХ 199;ха два нуля два эс хэ регион сто девяносто девять',
                'Х002СХ 199;х два ноля двойка сэ Харитон регион один девяносто девять',
                'Х002СХ 199;Харлампия дубль ноль два с Христофор регион один две девятки',
                'М999ММ 47;эм девятьсот девяносто девять два эм регион сорок семь',
                'М999ММ 47;мэ три девятки две эм регион четыре семь',
                'М999ММ 47;м триплет девяток дубль эм регион сорок семь',
                'Е003АЕ 99;е дуплет нулей три а Евгений регион дубль девять',
                'Е003АЕ 99;Елена дуплет нолей тройка Александр Егор регион дуплет девяток',
                'Е003АЕ 99;е ноль нуль три Анна Евгений регион девять девять'
            ].join('\n'));
        });

        it('should get voiceovers for the european car numbers', () => {
            const inputDir = `${defaultInputDir}/the-european-car-numbers`;
            const inputFile = `${inputDir}/numbers.txt`;
            const args = [
                ...baseCmdArgs,
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
            const extendedArgs = [...generalArgs, '--statistics'];
            runner.run(extendedArgs);
            expect(output.getLogs()).toContain('Statistics');
        });

        it('should not print statistics by default', () => {
            runner.run(generalArgs);
            expect(output.getLogs()).not.toContain('Statistics');
        });
    });

    afterAll(() => {
        fs.rmSync(outputDir, { recursive: true });
    });
});