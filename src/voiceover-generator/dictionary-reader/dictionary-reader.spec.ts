import { DictionaryReader } from './dictionary-reader';

describe('DictionaryReader', () => {
    let reader: DictionaryReader;

    const inputDir = `${__dirname}/spec-assets`;

    beforeEach(() => {
        reader = new DictionaryReader();
    });

    describe('#read', () => {

        it('should read voiceover dictionary with windows-like (crlf) end of line (eol)', () => {
            const filename = `${inputDir}/voiceover.dictionary.eol-crlf.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });

        it('should read voiceover dictionary with unix-like (lf) end of line (eol)', () => {
            const filename = `${inputDir}/voiceover.dictionary.eol-lf.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });

        it('should read voiceover dictionary with classic macos-like (cr) end of line (eol)', () => {
            const filename = `${inputDir}/voiceover.dictionary.eol-cr.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });

        it('should filter out empty lines', () => {
            const filename = `${inputDir}/voiceover.dictionary.empty-line.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ'],
                '00': ['два нуля', 'два ноля', 'дубль ноль']
            });
        });

        it('should filter out lines with empty options', () => {
            const filename = `${inputDir}/voiceover.dictionary.empty-option.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ']
            });
        });

        it('should trim spaces for values', () => {
            const filename = `${inputDir}/voiceover.dictionary.values-with-spaces.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М': ['эм', 'мэ', 'ма', 'ме']
            });
        });

        it('should not trim spaces for keys', () => {
            const filename = `${inputDir}/voiceover.dictionary.keys-with-spaces.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                'М ': ['эм', 'мэ'],
                ' Н': ['эн', 'нэ'],
                ' О ': ['о']
            });
        });

        it('should not clear a space key', () => {
            const filename = `${inputDir}/voiceover.dictionary.space-key.csv`;

            const voiceovers = reader.read(filename);

            // noinspection NonAsciiCharacters
            expect(voiceovers).toEqual({
                ' ': ['регион']
            });
        });
    });
});