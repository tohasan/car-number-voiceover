import { GeneratorCli } from '../generator-cli/generator-cli';
import { Generator } from '../generator/generator';
import { PatternParser } from '../pattern-parser/pattern-parser';
import { Exporter } from '../../common/exporter/exporter';

export class Runner {
    private readonly cli = new GeneratorCli();
    private readonly patternParser = new PatternParser();
    private readonly generator = new Generator();
    private readonly exporter = new Exporter();

    run(args: string[]): void {
        const { pattern, definitions, output } = this.cli.parse(args);
        const facets = this.patternParser.parse(pattern, definitions);
        const carNumbers = this.generator.generate(facets);
        this.exporter.export(output, carNumbers);
    }
}