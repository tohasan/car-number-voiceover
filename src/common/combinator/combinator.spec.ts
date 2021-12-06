import { Combinator } from './combinator';

describe('Combinator', () => {
    let combinator: Combinator;

    beforeEach(() => {
        combinator = new Combinator();
    });

    describe('#mixIndependently', () => {

        it('should apply offset for all the positions besides maximum', () => {
            const higherOrderFacets = [
                [['A'], ['B']], [['C'], ['D'], ['E'], ['F']], [['L'], ['M'], ['N']]
            ];

            const combinations = combinator.mixIndependently(higherOrderFacets, 1);

            expect(combinations).toEqual([
                ['A', 'C', 'M'],
                ['B', 'D', 'N'],
                ['A', 'E', 'L'],
                ['B', 'F', 'M']
            ]);
        });

        it('should apply offset for all the positions besides maximum ' +
            'even if there are multiple positions with maximum length', () => {
            const higherOrderFacets = [
                [['A'], ['B']], [['C'], ['D']], [['E'], ['F']]
            ];

            const combinations = combinator.mixIndependently(higherOrderFacets, 1);

            expect(combinations).toEqual([
                ['A', 'D', 'E'],
                ['B', 'C', 'F']
            ]);
        });
    });

    describe('#cartesianProductWithOverlapping', () => {

        it('should generate different combinations swallowing facets if a key is greater than 1 char', () => {
            const facets = [
                ['B'],
                ['0'],
                ['6', '65'],
                ['5'],
                ['X'],
                ['B'],
                [' '],
                ['1', '17', '177'],
                ['7', '77'],
                ['7']
            ];

            const combinations = combinator.cartesianProductWithOverlapping(facets);

            expect(combinations).toEqual([
                ['B', '0', '6', '5', 'X', 'B', ' ', '1', '7', '7'],
                ['B', '0', '6', '5', 'X', 'B', ' ', '1', '77'],
                ['B', '0', '6', '5', 'X', 'B', ' ', '17', '7'],
                ['B', '0', '6', '5', 'X', 'B', ' ', '177'],
                ['B', '0', '65', 'X', 'B', ' ', '1', '7', '7'],
                ['B', '0', '65', 'X', 'B', ' ', '1', '77'],
                ['B', '0', '65', 'X', 'B', ' ', '17', '7'],
                ['B', '0', '65', 'X', 'B', ' ', '177']
            ]);
        });
    });
});