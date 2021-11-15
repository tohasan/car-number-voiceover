import { Combinator } from './combinator';

describe('Combinator', () => {
    let combinator: Combinator;

    beforeEach(() => {
        combinator = new Combinator();
    });

    describe('#cartesianProduct', () => {

        it('should generate a cartesian product of given facets', () => {
            const facets = [['A', 'B'], ['0', '1'], ['4', '8'], [' '], ['78', '79']];

            const combinations = combinator.cartesianProduct(facets);

            expect(combinations).toEqual([
                ['A', '0', '4', ' ', '78'],
                ['A', '0', '4', ' ', '79'],
                ['A', '0', '8', ' ', '78'],
                ['A', '0', '8', ' ', '79'],
                ['A', '1', '4', ' ', '78'],
                ['A', '1', '4', ' ', '79'],
                ['A', '1', '8', ' ', '78'],
                ['A', '1', '8', ' ', '79'],
                ['B', '0', '4', ' ', '78'],
                ['B', '0', '4', ' ', '79'],
                ['B', '0', '8', ' ', '78'],
                ['B', '0', '8', ' ', '79'],
                ['B', '1', '4', ' ', '78'],
                ['B', '1', '4', ' ', '79'],
                ['B', '1', '8', ' ', '78'],
                ['B', '1', '8', ' ', '79']
            ]);
        });
    });
});