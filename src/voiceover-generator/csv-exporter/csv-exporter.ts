import { Exporter } from '../../common/exporter/exporter';
import { Filename } from '../../common/entities/filename';

export class CsvExporter {
    private exporter = new Exporter();

    export(filename: Filename, records: object[]): void {
        // eslint-disable-next-line no-console
        console.log(filename, records);
        this.exporter.export(filename, []);
    }
}