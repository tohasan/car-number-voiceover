import { ExportOptions } from '../entities/export-options';
import * as fs from 'fs';
import path from 'path';

export class Exporter {

    constructor(private readonly options: ExportOptions) {
    }

    export(records: string[]): void {
        const { filename } = this.options;
        const dir = path.dirname(filename);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filename, records.join('\n'));
    }
}