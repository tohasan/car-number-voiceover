import { Exporter } from '../../common/exporter/exporter';
import { Filename } from '../../common/entities/filename';
import { Voiceover } from '../entities/voiceover';

export class CsvExporter {
    private exporter = new Exporter();

    export(filename: Filename, records: Voiceover[]): void {
        const stringifiedRecords = records.map(({ name, options }) => `${name};${options.join(',')}`);
        this.exporter.export(filename, stringifiedRecords);
    }
}