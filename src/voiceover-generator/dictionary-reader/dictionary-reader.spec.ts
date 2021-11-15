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

        it('should filter out empty lines', () => {
            const filename = `${inputDir}/voiceover.dictionary.with-empty-line.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });

        it('should filter out lines with empty options', () => {
            const filename = `${inputDir}/voiceover.dictionary.with-empty-option.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ']
            });
        });

        it('should not clear a space key', () => {
            const filename = `${inputDir}/voiceover.dictionary.with-space-key.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                ' ': ['регион']
            });
        });
    });
});