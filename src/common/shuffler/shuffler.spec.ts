import { Shuffler } from './shuffler';
import { CarNumber } from '../entities/car-number';

describe('Shuffler', () => {
    let shuffler: Shuffler<CarNumber>;

    beforeEach(() => {
        shuffler = new Shuffler<CarNumber>();
    });

    describe('#shuffle', () => {

        it('should shuffle a list', () => {
            const items = [
                'LV AA-1110',
                'LV AC-1111',
                'LV AE-1112',
                'LV AG-1113',
                'LV BA-2110',
                'LV BC-2111',
                'LV BE-2112',
                'LV BG-2113'
            ];

            const shuffled = shuffler.shuffle(items);

            expect(shuffled).toEqual([
                'LV AG-1113',
                'LV BG-2113',
                'LV AA-1110',
                'LV BA-2110',
                'LV BC-2111',
                'LV BE-2112',
                'LV AC-1111',
                'LV AE-1112'
            ]);
        });
    });
});