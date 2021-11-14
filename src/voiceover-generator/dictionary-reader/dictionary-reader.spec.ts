import { DictionaryReader } from './dictionary-reader';

describe('DictionaryReader', () => {
    let reader: DictionaryReader;

    const inputDir = `${__dirname}/spec-assets`;

    beforeEach(() => {
        reader = new DictionaryReader();
    });

    describe('#read', () => {

        it('should read voiceover dictionary', () => {
            const filename = `${inputDir}/voiceover.dictionary.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });
    });
});