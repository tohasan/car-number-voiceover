import { Generator } from './generator';

describe('Generator', () => {
    let generator: Generator;

    beforeEach(() => {
        generator = new Generator();
    });

    describe('#generate', () => {

        it('should generate all the variants of the car numbers by given facets', () => {
            const facets = [['A', 'B'], ['0', '1'], ['4', '8'], [' '], ['78', '79']];

            const carNumbers = generator.generate(facets);

            expect(carNumbers).toEqual([
                'A04 78',
                'A04 79',
                'A08 78',
                'A08 79',
                'A14 78',
                'A14 79',
                'A18 78',
                'A18 79',
                'B04 78',
                'B04 79',
                'B08 78',
                'B08 79',
                'B14 78',
                'B14 79',
                'B18 78',
                'B18 79'
            ]);
        });
    });
});