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
});