import { Filename } from '../../common/entities/filename';

export interface CliArguments {
    input: Filename;
    dictionary: Filename;
    output: Filename;
    countPerNumber?: number;
    _: string[];
}