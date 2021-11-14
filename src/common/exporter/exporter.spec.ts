import { Exporter } from './exporter';
import * as fs from 'fs';
import { Filename } from '../../number-generator/entities/filename';

describe('Exporter', () => {
    const filename = `${__dirname}/numbers.txt`;
    const nestedOutputRoot = `${__dirname}/output`;
    const nestedOutputDir = `${nestedOutputRoot}/deep/nested`;
    const nestedFilename = `${nestedOutputDir}/numbers.txt`;

    describe('#export', () => {
        const records = ['A001MH 78', 'C777YX 79'];

        it('should export given records', () => {
            const exporter = new Exporter({ filename });
            exporter.export(records);
            expect(getFileContent(filename)).toEqual(records.join('\n'));
        });

        it('should create the full path to the file if it does not exist', () => {
            fs.rmdirSync(nestedOutputDir, { recursive: true });
            const exporter = new Exporter({ filename: nestedFilename });

            exporter.export(records);

            expect(getFileContent(nestedFilename)).toEqual(records.join('\n'));
        });

        it('should override the content of the file if it exists', () => {
            fs.writeFileSync(filename, 'some content');
            const exporter = new Exporter({ filename });

            exporter.export(records);

            expect(getFileContent(filename)).toEqual(records.join('\n'));
        });
    });

    afterAll(() => {
        fs.rmSync(filename);
        fs.rmdirSync(nestedOutputRoot, { recursive: true });
    });
});

function getFileContent(filename: Filename): string {
    return fs.readFileSync(filename, 'utf8');
}