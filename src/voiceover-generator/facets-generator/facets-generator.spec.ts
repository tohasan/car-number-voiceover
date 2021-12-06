import { FacetsGenerator } from './facets-generator';
import { dependencies } from '../../common/utils/specs/dependencies';
import fs from 'fs';

describe('FacetsGenerator', () => {
    let generator: FacetsGenerator;

    const { output } = dependencies;

    beforeEach(() => {
        generator = new FacetsGenerator();
    });

    describe('#generate', () => {

        it('should return a single set of voiceover options ' +
            'if the dictionary contains only single-positioned keys', () => {
            const carNumbers = ['A01'];
            const voiceoverKeys = ['A', 'E', 'H', 'M', '0', '1', '2'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['A', '0', '1']
            ]);
        });

        it('should skip characters that it can not resolve by the provided dictionary', () => {
            const carNumbers = ['A011 MH'];
            const voiceoverKeys = ['M', '0', '1'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['0', '1', '1', 'M']
            ]);
        });

        it('should warn about not found keys', () => {
            const carNumbers = ['A011 MH'];
            const voiceoverKeys = ['M', '0', '1'];

            generator.generate(carNumbers, voiceoverKeys);

            expect(output.getLogs()).toEqual([
                'WARN The following characters are not found in any dictionary key:',
                '  A [0x0041]',
                '    [0x0020]',
                '  H [0x0048]'
            ].join('\n'));
        });

        it('should not display warning if there is nothing to warn', () => {
            const carNumbers = ['A011 MH'];
            const voiceoverKeys = ['A', 'M', '0', '1', ' ', 'H'];

            generator.generate(carNumbers, voiceoverKeys);

            expect(output.getLogs()).not.toContain('WARN The following characters are not found');
        });

        it('should generate facet sets for double-positioned voiceovers', () => {
            const carNumbers = ['A011MH'];
            const voiceoverKeys = ['A', 'E', 'H', 'M', 'MH', '0', '1', '11'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['A', '0', '1', '1', 'M', 'H'],
                ['A', '0', '1', '1', 'MH'],
                ['A', '0', '11', 'M', 'H'],
                ['A', '0', '11', 'MH']
            ]);
        });

        it('should generate facet sets for double-positioned voiceovers ' +
            'if the number contains tripled character', () => {
            const carNumbers = ['A111MH'];
            const voiceoverKeys = ['A', 'H', 'M', '0', '1', '11'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['A', '1', '1', '1', 'M', 'H'],
                ['A', '1', '11', 'M', 'H'],
                ['A', '11', '1', 'M', 'H']
            ]);
        });

        it('should generate facet sets for tripled-positioned voiceovers ' +
            'if the number contains tripled character', () => {
            const carNumbers = ['A111MH'];
            const voiceoverKeys = ['A', 'H', 'M', '0', '111', '1', '11'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['A', '1', '1', '1', 'M', 'H'],
                ['A', '1', '11', 'M', 'H'],
                ['A', '11', '1', 'M', 'H'],
                ['A', '111', 'M', 'H']
            ]);
        });

        it('should generate additional facet sets if there is a triple-positioned voiceovers ' +
            'but there is no such combinations in the number', () => {
            const carNumbers = ['A011MH'];
            const voiceoverKeys = ['A', 'H', 'M', '0', '1'];

            const facets = generator.generate(carNumbers, voiceoverKeys);

            expect(facets).toEqual([
                ['A', '0', '1', '1', 'M', 'H']
            ]);
        });

        it('should be able to generate voiceovers for 1k+ dictionary keys less than 500 ms', () => {
            const carNumbers = ['В065ХВ 177'];
            const voiceoverKeys = readRecords(`${__dirname}/spec-assets/voiceover-keys.1k.txt`);
            const startTime = Date.now();

            const facets = generator.generate(carNumbers, voiceoverKeys);

            const timeSpent = Date.now() - startTime;
            const expectedTimeLimitInMilliseconds = 500;
            expect(facets).toEqual([
                ['В', '0', '6', '5', 'Х', 'В', ' ', '1', '7', '7'],
                ['В', '0', '6', '5', 'Х', 'В', ' ', '1', '77'],
                ['В', '0', '6', '5', 'Х', 'В', ' ', '17', '7'],
                ['В', '0', '6', '5', 'Х', 'В', ' ', '177'],
                ['В', '0', '65', 'Х', 'В', ' ', '1', '7', '7'],
                ['В', '0', '65', 'Х', 'В', ' ', '1', '77'],
                ['В', '0', '65', 'Х', 'В', ' ', '17', '7'],
                ['В', '0', '65', 'Х', 'В', ' ', '177']
            ]);
            expect(timeSpent).toBeLessThan(expectedTimeLimitInMilliseconds);
        });

        it('should be able to generate voiceovers for 500 car numbers ' +
            'and 1k+ dictionary keys ' +
            'less than 500 ms', () => {
            const carNumbers = readRecords(`${__dirname}/spec-assets/numbers.500.txt`);
            const voiceoverKeys = readRecords(`${__dirname}/spec-assets/voiceover-keys.1k.txt`);
            const startTime = Date.now();

            generator.generate(carNumbers, voiceoverKeys);

            const timeSpent = Date.now() - startTime;
            const expectedTimeLimitInMilliseconds = 500;
            expect(timeSpent).toBeLessThan(expectedTimeLimitInMilliseconds);
        });
    });

    function readRecords(filename: string): string[] {
        const content = fs.readFileSync(filename, 'utf8');
        return content.split(/\r?\n/);
    }
});