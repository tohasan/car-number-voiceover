import { GeneratorCli } from '../generator-cli/generator-cli';
import { Generator } from '../generator/generator';
import { PatternParser } from '../pattern-parser/pattern-parser';
import { Exporter } from '../../common/exporter/exporter';
import { Logger } from '../../common/utils/logger/logger';
import { Shuffler } from '../shuffler/shuffler';
import { CarNumber } from '../../common/entities/car-number';

export class Runner {
    private readonly cli = new GeneratorCli();
    private readonly patternParser = new PatternParser();
    private readonly generator = new Generator();
    private readonly shuffler = new Shuffler<CarNumber>();
    private readonly exporter = new Exporter();
    private readonly logger = new Logger();

    run(args: string[]): void {
        const startTime = Date.now();

        const { pattern, definitions, output, count, shuffle: needToShuffle } = this.cli.parse(args);
        const facets = this.patternParser.parse(pattern, definitions);
        let carNumbers = this.generator.generate(facets, count);

        if (needToShuffle) {
            carNumbers = this.shuffler.shuffle(carNumbers);
        }

        this.exporter.export(output, carNumbers);

        this.logger.log(`You can find the result in the file: ${output}`);
        this.logger.log(`Time spent: ${Date.now() - startTime} ms`);
    }
}