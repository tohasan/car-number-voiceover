import { CliArguments } from '../entities/cli-arguments';

export class GeneratorCli {

    parse(commandLineArgs: string[]): CliArguments {
        // eslint-disable-next-line no-console
        console.log(commandLineArgs);
        return {} as CliArguments;
    }
}