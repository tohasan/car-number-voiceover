import { PatternParser } from './pattern-parser';

describe('PatternParser', () => {
    let parser: PatternParser;

    beforeEach(() => {
        parser = new PatternParser();
    });

    describe('#parse', () => {

        it('should parse pattern with definitions', () => {
            const pattern = '[L, D, D, D, L, L, S, R]';
            const definitions = [
                'L=[А,В,Е,К,М,Н,О,Р,С,Т,У,Х]',
                'D=[0-9]',
                'S=[ ]',
                'R=[78,79]'
            ];

            const facets = parser.parse(pattern, definitions);

            const [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8] = facets;
            const letters = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];
            const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            const spaces = [' '];
            const regions = ['78', '79'];
            expect(pos1).toEqual(letters);
            expect(pos2).toEqual(digits);
            expect(pos3).toEqual(digits);
            expect(pos4).toEqual(digits);
            expect(pos5).toEqual(letters);
            expect(pos6).toEqual(letters);
            expect(pos7).toEqual(spaces);
            expect(pos8).toEqual(regions);
        });

        it('should throw an exception if a pattern has unresolved definition', () => {
            const pattern = '[D, L, D]';
            const definitions = ['D=[0-9]'];

            expect(() => parser.parse(pattern, definitions)).toThrow('Can not find a definition for: \'L\'');
        });
    });
});