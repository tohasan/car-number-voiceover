import { PatternParser } from './pattern-parser';
import { FacetConfig } from './facet-config';

describe('PatternParser', () => {
    let parser: PatternParser;

    beforeEach(() => {
        parser = new PatternParser();
    });

    describe('#parse', () => {

        it('should parse a pattern', () => {
            const pattern = '[L1, D, D, D, L2, L2, S, R, R, R]';

            const facetConfigs = parser.parse(pattern);

            const expected: FacetConfig[] = [
                { id: 'L1', length: 1 },
                { id: 'D', length: 3 },
                { id: 'L2', length: 2 },
                { id: 'S', length: 1 },
                { id: 'R', length: 3 }
            ];
            expect(facetConfigs).toEqual(expected);
        });
    });
});