import { Logger } from '../../utils/logger/logger';
import { GeneratorCli } from '../generator-cli/generator-cli';
import { Generator } from '../generator/generator';
import { PatternParser } from '../pattern-parser/pattern-parser';
import { Exporter } from '../exporter/exporter';

export class Runner {
    private logger = new Logger();
    private readonly cli = new GeneratorCli();
    private readonly patternParser = new PatternParser();
    private readonly generator = new Generator();

    run(args: string[]): void {
        this.logger.log(`run with arguments: ${args}`);
        const { pattern, definitions, output } = this.cli.parse(args);
        const facets = this.patternParser.parse(pattern, definitions);
        const carNumbers = this.generator.generate(facets);
        const exporter = new Exporter({ filename: output });
        exporter.export(carNumbers);
    }
}