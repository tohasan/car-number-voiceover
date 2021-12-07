import { FacetsGenerator } from './facets-generator';
import { dependencies } from '../../common/utils/specs/dependencies';
import { FileReader } from '../file-reader/file-reader';
import { FacetConfig } from '../pattern-parser/facet-config';
import { CarNumber } from '../../common/entities/car-number';
import { RealFacet } from './real-facet';

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
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 2 };
            const facetConfigs = [configPrefix, configNumber];
            const voiceoverKeys = ['A', 'E', 'H', 'M', '0', '1', '2'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A01',
                    [
                        { config: configPrefix, keySets: [['A']] },
                        { config: configNumber, keySets: [['0', '1']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should correctly handle the last facet if its length exceeds a car number', () => {
            const carNumbers = ['A01'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const facetConfigs = [configPrefix, configNumber];
            const voiceoverKeys = ['A', 'E', 'H', 'M', '0', '1', '2'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A01',
                    [
                        { config: configPrefix, keySets: [['A']] },
                        { config: configNumber, keySets: [['0', '1']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should skip characters that it can not resolve by the provided dictionary', () => {
            const carNumbers = ['A021 MH'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configEmpty: FacetConfig = { id: 'E', length: 1 };
            const configRegion: FacetConfig = { id: 'R', length: 2 };
            const facetConfigs = [configPrefix, configNumber, configEmpty, configRegion];
            const voiceoverKeys = ['M', '0', '1'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A021 MH',
                    [
                        { config: configPrefix, keySets: [] },
                        // FIXME: Probably, it should be: { config: configNumber, keySets: [['0', '1']] },
                        { config: configNumber, keySets: [] },
                        { config: configEmpty, keySets: [] },
                        // FIXME: Probably, it should be: { config: configRegion, keySets: [['M']] }
                        { config: configRegion, keySets: [] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should warn about not found keys', () => {
            const carNumbers = ['A011 MH'];
            const facetConfigs: FacetConfig[] = [];
            const voiceoverKeys = ['M', '0', '1'];

            generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(output.getLogs()).toEqual([
                'WARN The following characters are not found in any dictionary key:',
                '  A [0x0041]',
                '    [0x0020]',
                '  H [0x0048]'
            ].join('\n'));
        });

        it('should not display warning if there is nothing to warn', () => {
            const carNumbers = ['A011 MH'];
            const facetConfigs: FacetConfig[] = [];
            const voiceoverKeys = ['A', 'M', '0', '1', ' ', 'H'];

            generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(output.getLogs()).not.toContain('WARN The following characters are not found');
        });

        it('should generate facet sets for double-positioned voiceovers ' +
            'ordered starting from the most long combination', () => {
            const carNumbers = ['A011MH'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configSeries: FacetConfig = { id: 'S', length: 2 };
            const facetConfigs = [configPrefix, configNumber, configSeries];
            const voiceoverKeys = ['A', 'E', 'H', 'M', 'MH', '0', '1', '11'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A011MH',
                    [
                        { config: configPrefix, keySets: [['A']] },
                        { config: configNumber, keySets: [['0', '11'], ['0', '1', '1']] },
                        { config: configSeries, keySets: [['MH'], ['M', 'H']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should generate facet sets for double-positioned voiceovers ' +
            'if the number contains tripled character', () => {
            const carNumbers = ['A111MH'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configSeries: FacetConfig = { id: 'S', length: 2 };
            const facetConfigs = [configPrefix, configNumber, configSeries];
            const voiceoverKeys = ['A', 'H', 'M', '0', '1', '11'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A111MH',
                    [
                        { config: configPrefix, keySets: [['A']] },
                        { config: configNumber, keySets: [['11', '1'], ['1', '11'], ['1', '1', '1']] },
                        { config: configSeries, keySets: [['M', 'H']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should generate facet sets for tripled-positioned voiceovers ' +
            'if the number contains tripled character', () => {
            const carNumbers = ['A111MH'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configSeries: FacetConfig = { id: 'S', length: 2 };
            const facetConfigs = [configPrefix, configNumber, configSeries];
            const voiceoverKeys = ['A', 'H', 'M', '0', '111', '1', '11'];

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'A111MH',
                    [
                        { config: configPrefix, keySets: [['A']] },
                        { config: configNumber, keySets: [['111'], ['11', '1'], ['1', '11'], ['1', '1', '1']] },
                        { config: configSeries, keySets: [['M', 'H']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
        });

        it('should be able to generate voiceovers for 1k+ dictionary keys less than 500 ms', () => {
            const fileReader = new FileReader();
            const carNumbers = ['В065ХВ 177'];
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configSeries: FacetConfig = { id: 'S', length: 2 };
            const configEmpty: FacetConfig = { id: 'E', length: 1 };
            const configRegion: FacetConfig = { id: 'R', length: 3 };
            const facetConfigs = [configPrefix, configNumber, configSeries, configEmpty, configRegion];
            const voiceoverKeys = fileReader.read(`${__dirname}/spec-assets/voiceover-keys.1k.txt`);
            const startTime = Date.now();

            const facets = generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            expect(Array.from(facets.entries())).toEqual([
                [
                    'В065ХВ 177',
                    [
                        { config: configPrefix, keySets: [['В']] },
                        { config: configNumber, keySets: [['0', '65'], ['0', '6', '5']] },
                        { config: configSeries, keySets: [['Х', 'В']] },
                        { config: configEmpty, keySets: [[' ']] },
                        { config: configRegion, keySets: [['177'], ['17', '7'], ['1', '77'], ['1', '7', '7']] }
                    ]
                ]
            ] as [CarNumber, RealFacet[]][]);
            const timeSpent = Date.now() - startTime;
            const expectedTimeLimitInMilliseconds = 500;
            expect(timeSpent).toBeLessThan(expectedTimeLimitInMilliseconds);
        });

        it('should be able to generate voiceovers for 500 car numbers ' +
            'and 1k+ dictionary keys ' +
            'less than 500 ms', () => {
            const fileReader = new FileReader();
            const carNumbers = fileReader.read(`${__dirname}/spec-assets/numbers.500.txt`);
            const facetConfigs: FacetConfig[] = [];
            const voiceoverKeys = fileReader.read(`${__dirname}/spec-assets/voiceover-keys.1k.txt`);
            const startTime = Date.now();

            generator.generate(carNumbers, facetConfigs, voiceoverKeys);

            const timeSpent = Date.now() - startTime;
            const expectedTimeLimitInMilliseconds = 500;
            expect(timeSpent).toBeLessThan(expectedTimeLimitInMilliseconds);
        });
    });
});