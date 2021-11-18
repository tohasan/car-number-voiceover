import { Combinator } from './combinator';

describe('Combinator', () => {
    let combinator: Combinator;

    beforeEach(() => {
        combinator = new Combinator();
    });

    describe('#mix', () => {

        it('should generate only different options in each cell', () => {
            const facets = [['A', 'B'], ['4', '8'], [' '], ['78', '79']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '4', ' ', '78'],
                ['B', '8', ' ', '79']
            ]);
        });

        it('should generate different options by a maximum cell', () => {
            const facets = [['A', 'B'], ['1', '2', '3', '4', '5']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '1'],
                ['B', '2'],
                ['A', '3'],
                ['B', '4'],
                ['A', '5']
            ]);
        });

        it('should generate all different combinations of letters following each other', () => {
            const facets = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['1', '2', '3', '4', '5'], ['M', 'N']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', 'C', 'E', '1', 'M'],
                ['A', 'C', 'F', '2', 'N'],
                ['A', 'D', 'E', '3', 'M'],
                ['A', 'D', 'F', '4', 'N'],
                ['B', 'C', 'E', '5', 'M'],
                ['B', 'C', 'F', '1', 'N'],
                ['B', 'D', 'E', '2', 'M'],
                ['B', 'D', 'F', '3', 'N']
            ]);
        });

        it('should generate only different numeric combinations', () => {
            const facets = [['A', 'B'], ['0', '2', '3'], ['4', '5']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '0', '4'],
                ['B', '0', '5'],
                ['A', '2', '4'],
                ['B', '3', '5']
            ]);
        });

        it('should generate special numeric combinations for 10-19', () => {
            const facets = [['A', 'B'], ['0', '1', '2'], ['4', '8']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '0', '4'],
                ['B', '0', '8'],
                ['A', '1', '4'],
                ['B', '1', '8'],
                ['A', '2', '4']
            ]);
        });

        it('should consider numeric combinations 20, 30, ... as others (nothing special)', () => {
            const facets = [['A', 'B'], ['2', '3', '4'], ['0', '4', '8']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '2', '0'],
                ['B', '2', '4'],
                ['A', '2', '8'],
                ['B', '3', '0'],
                ['A', '4', '4']
            ]);
        });

        it('should consider numeric combinations for 100, 200, ... as others (nothing special)', () => {
            const facets = [['A', 'B'], ['1', '2', '3'], ['0', '8'], ['0', '9']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '1', '0', '0'],
                ['B', '1', '0', '9'],
                ['A', '1', '8', '0'],
                ['B', '2', '0', '9'],
                ['A', '3', '8', '0']
            ]);
        });

        it('should generate pairs of the same value for numbers', () => {
            const facets = [['A', 'B'], ['1', '2', '3'], ['1', '2', '8'], ['3', '9']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '1', '1', '3'],
                ['B', '1', '2', '9'],
                ['A', '1', '8', '3'],
                ['B', '2', '2', '9'],
                ['A', '3', '3', '3']
            ]);
        });

        it('should generate pairs of the same value for letters', () => {
            const facets = [['A', 'B', 'C'], ['A', 'C', 'D'], ['2', '8'], ['A', 'B']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', 'A', '2', 'A'],
                ['A', 'C', '8', 'B'],
                ['A', 'D', '2', 'A'],
                ['B', 'A', '8', 'B'],
                ['B', 'C', '2', 'A'],
                ['B', 'D', '8', 'B'],
                ['C', 'A', '2', 'A'],
                ['C', 'C', '8', 'B'],
                ['C', 'D', '2', 'A']
            ]);
        });

        it('should generate triples of the same value for numbers', () => {
            const facets = [['A', 'B'], ['1', '2', '3'], ['1', '2', '8'], ['3', '9']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '1', '2', '0'],
                ['B', '2', '0', '0'],
                ['A', '3', '0', '0'],
                ['B', '1', '0', '8'],
                ['A', '2', '0', '9'],
                ['B', '3', '8', '0'],
                ['A', '1', '8', '9']
            ]);
        });

        it('should generate triples of the same value for letters', () => {
            const facets = [['A', 'B'], ['A', 'B'], ['A', 'B'], ['3', '9']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', 'A', 'A', '3'],
                ['A', 'A', 'B', '9'],
                ['A', 'B', 'A', '3'],
                ['A', 'B', 'B', '9'],
                ['B', 'A', 'A', '3'],
                ['B', 'A', 'B', '9'],
                ['B', 'B', 'A', '3'],
                ['B', 'B', 'B', '9']
            ]);
        });

        it('should not generate zero numbers', () => {
            const facets = [['A', 'B'], ['0', '1'], ['0', '2']];

            const combinations = combinator.mix(facets);

            expect(combinations).toEqual([
                ['A', '0', '2'],
                ['B', '1', '0'],
                ['A', '1', '2']
            ]);
        });

        it('should apply different rules', () => {

        });
    });
});