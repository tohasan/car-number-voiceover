import { CarNumber } from '../../common/entities/car-number';
import * as fs from 'fs';
import { EOL } from 'os';

export class CarNumbersReader {

    read(filename: string): CarNumber[] {
        const content = fs.readFileSync(filename, 'utf8');
        return content.split(EOL);
    }
}