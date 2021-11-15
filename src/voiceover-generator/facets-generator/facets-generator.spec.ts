import { FacetsGenerator } from './facets-generator';

describe('FacetsGenerator', () => {
    let generator: FacetsGenerator;

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
    });
});