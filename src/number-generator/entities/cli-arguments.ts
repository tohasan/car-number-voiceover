export interface CliArguments {
    pattern: string;
    definitions: string[];
    output: string;
    count?: number;
    shuffle: boolean;
    _: string[];
}