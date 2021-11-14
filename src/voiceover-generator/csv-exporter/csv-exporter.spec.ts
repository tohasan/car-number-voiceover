import { CsvExporter } from './csv-exporter';
import * as fs from 'fs';
import { Filename } from '../../common/entities/filename';
import { Voiceover } from '../entities/voiceover';

describe('CsvExporter', () => {
    let exporter: CsvExporter;
    const filename = `${__dirname}/voiceovers.csv`;

    beforeEach(() => {
        exporter = new CsvExporter();
    });

    describe('#export', () => {
        const records: Voiceover[] = [
            {
                name: 'A001MH 78',
                options: ['а два ноля единица эм эн регион семьдесят восемь']
            },
            {
                name: 'C777YX 79',
                options: ['си джекпот увай экс семьдесят девятый регион']
            }
        ];

        it('should export given records', () => {
            exporter.export(filename, records);

            expect(getFileContent(filename)).toEqual([
                'name;options',
                'A001MH 78;а два ноля единица эм эн регион семьдесят восемь',
                'C777YX 79;си джекпот увай экс семьдесят девятый регион'
            ].join('\n'));
        });
    });

    afterAll(() => {
        fs.rmSync(filename);
    });
});

function getFileContent(filename: Filename): string {
    return fs.readFileSync(filename, 'utf8');
}