import { GeneratorCli } from '../generator-cli/generator-cli';
import { Generator } from '../generator/generator';
import { PatternParser } from '../pattern-parser/pattern-parser';
import { Exporter } from '../../common/exporter/exporter';
import { Logger } from '../../common/utils/logger/logger';

export class Runner {
    private readonly cli = new GeneratorCli();
    private readonly patternParser = new PatternParser();
    private readonly generator = new Generator();
    private readonly exporter = new Exporter();
    private readonly logger = new Logger();

    run(args: string[]): void {
        const startTime = Date.now();

        const { pattern, definitions, output, count, shuffle } = this.cli.parse(args);
        const facets = this.patternParser.parse(pattern, definitions);
        const carNumbers = this.generator.generate(facets, { requestedCount: count, needToShuffle: shuffle });
        this.exporter.export(output, carNumbers);

        this.logger.log(`You can find the result in the file: ${output}`);
        this.logger.log(`Time spent: ${Date.now() - startTime} ms`);
    }
}