import * as fs from 'fs';
import path from 'path';
import { Filename } from '../entities/filename';

export class Exporter {

    export(filename: Filename, records: string[]): void {
        const dir = path.dirname(filename);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filename, records.join('\n'));
    }
}