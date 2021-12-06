import { FileReader } from './file-reader';

describe('FileReader', () => {
    let reader: FileReader;

    const inputDir = `${__dirname}/spec-assets`;

    beforeEach(() => {
        reader = new FileReader();
    });

    describe('#read', () => {

        it('should read a file with windows-like (crlf) end of line', () => {
            const filename = `${inputDir}/numbers.crlf.txt`;
            const numbers = reader.read(filename);
            expect(numbers).toEqual(['А002ВВ 78', 'О124МН 79']);
        });

        it('should read a file with unix-like (lf) end of line', () => {
            const filename = `${inputDir}/numbers.lf.txt`;
            const numbers = reader.read(filename);
            expect(numbers).toEqual(['А002ВВ 78', 'О124МН 79']);
        });

        it('should read a file with classic macos-like (cr) end of line', () => {
            const filename = `${inputDir}/numbers.cr.txt`;
            const numbers = reader.read(filename);
            expect(numbers).toEqual(['А002ВВ 78', 'О124МН 79']);
        });
    });
});