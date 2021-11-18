import { Generator } from './generator';

describe('Generator', () => {
    let generator: Generator;

    beforeEach(() => {
        generator = new Generator();
    });

    describe('#generate', () => {

        it('should generate only different options in each cell', () => {
            const facets = [['A', 'B'], ['4', '8'], [' '], ['78', '79']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A4 78',
                'B8 79'
            ]);
        });

        it('should generate different options by a maximum cell', () => {
            const facets = [['A', 'B'], ['1', '2', '3', '4', '5']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A1',
                'B2',
                'A3',
                'B4',
                'A5'
            ]);
        });

        it('should generate all different combinations of letters following each other', () => {
            const facets = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['1', '2', '3', '4', '5'], ['M', 'N']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'ACE1M',
                'ACF2N',
                'ADE3M',
                'ADF4N',
                'BCE5M',
                'BCF1N',
                'BDE2M',
                'BDF3N'
            ]);
        });

        it('should generate only different numeric combinations', () => {
            const facets = [['A', 'B'], ['0', '2', '3'], ['4', '5']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A04',
                'B05',
                'A24',
                'B35'
            ]);
        });

        it('should generate special numeric combinations for 10-19', () => {
            const facets = [['A', 'B'], ['1', '2'], ['0', '1', '5'], ['4', '8']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A104',
                'B108',
                'A114',
                'B118',
                'A158',
                'B204'
            ]);
        });

        it('should generate special numeric combinations starting from 0', () => {
            const facets = [['A', 'B'], ['0', '2'], ['0', '3'], ['4', '8']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A004',
                'B008',
                'A034',
                'B208'
            ]);
        });

        it('should consider numeric combinations 20, 30, ... as others (nothing special)', () => {
            const facets = [['A', 'B'], ['2', '3', '4'], ['0', '4', '8']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A20',
                'B24',
                'A28',
                'B30',
                'A44'
            ]);
        });

        it('should consider numeric combinations for 100, 200, ... as others (nothing special)', () => {
            const facets = [['A', 'B'], ['1', '2', '3'], ['0', '8'], ['0', '9']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A100',
                'B109',
                'A180',
                'B209',
                'A380'
            ]);
        });

        it('should generate pairs of the same value for numbers', () => {
            const facets = [['A', 'B'], ['1', '2', '3'], ['1', '2', '8'], ['3', '9']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A113',
                'B119',
                'A123',
                'B189',
                'A213',
                'B223',
                'A329'
            ]);
        });

        it('should generate pairs of the same value for letters', () => {
            const facets = [['A', 'B', 'C'], ['A', 'C', 'D'], ['2', '8'], ['A', 'B']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'AA2A',
                'AC8B',
                'AD2A',
                'BA8B',
                'BC2A',
                'BD8B',
                'CA2A',
                'CC8B',
                'CD2A'
            ]);
        });

        it('should generate triples of the same value for numbers', () => {
            const facets = [['A', 'B'], ['2', '3'], ['2', '3'], ['2', '3', '4']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A222',
                'B223',
                'A224',
                'B232',
                'A233',
                'B323',
                'A333'
            ]);
        });

        it('should generate triples of the same value for letters', () => {
            const facets = [['A', 'B'], ['A', 'B'], ['A', 'B'], ['3', '9']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'AAA3',
                'AAB9',
                'ABA3',
                'ABB9',
                'BAA3',
                'BAB9',
                'BBA3',
                'BBB9'
            ]);
        });

        it('should not generate zero numbers', () => {
            const facets = [['A', 'B'], ['0', '1'], ['0', '2']];

            const combinations = generator.generate(facets);

            expect(combinations).toEqual([
                'A02',
                'B10',
                'A12'
            ]);
        });
    });
});