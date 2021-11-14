import { CarNumbersReader } from './car-numbers-reader';

describe('CarNumbersReader', () => {
    let reader: CarNumbersReader;

    const inputDir = `${__dirname}/spec-assets`;

    beforeEach(() => {
        reader = new CarNumbersReader();
    });

    describe('#read', () => {

        it('should read car numbers', () => {
            const filename = `${inputDir}/numbers.txt`;
            const numbers = reader.read(filename);
            expect(numbers).toEqual(['А002ВВ 78', 'О124МН 79']);
        });
    });
});