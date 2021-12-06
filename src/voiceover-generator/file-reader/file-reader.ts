import * as fs from 'fs';

export class FileReader {

    read(filename: string): string[] {
        const content = fs.readFileSync(filename, 'utf8');
        return content.split(/[\r\n]+/);
    }
}