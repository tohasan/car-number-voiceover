export interface CliArguments {
    pattern: string;
    definitions: string[];
    output: string;
    count?: number;
    _: string[];
}