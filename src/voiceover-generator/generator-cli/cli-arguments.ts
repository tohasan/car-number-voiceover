import { Filename } from '../../common/entities/filename';

export interface CliArguments {
    input: Filename;
    pattern: string;
    dictionary: Filename;
    output: Filename;
    countPerNumber: number;
    statistics: boolean;
    _: string[];
}