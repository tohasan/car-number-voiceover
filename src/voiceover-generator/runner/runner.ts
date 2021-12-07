import { CsvExporter } from '../csv-exporter/csv-exporter';
import { Generator } from '../generator/generator';
import { DictionaryReader } from '../dictionary-reader/dictionary-reader';
import { GeneratorCli } from '../generator-cli/generator-cli';
import { FacetsGenerator } from '../facets-generator/facets-generator';
import { Logger } from '../../common/utils/logger/logger';
import { StatisticsReporter } from '../statistics-reporter/statistics-reporter';
import { FileReader } from '../file-reader/file-reader';
import { PatternParser } from '../pattern-parser/pattern-parser';

export class Runner {

    private readonly cli = new GeneratorCli();
    private readonly carNumbersReader = new FileReader();
    private readonly dictionaryReader = new DictionaryReader();
    private readonly patternParser = new PatternParser();
    private readonly facetsGenerator = new FacetsGenerator();
    private readonly generator = new Generator();
    private readonly statisticsReporter = new StatisticsReporter();
    private readonly exporter = new CsvExporter();
    private readonly logger = new Logger();

    run(args: string[]): void {
        const startTime = Date.now();

        const { input, pattern, dictionary, output } = this.cli.parse(args);
        const { countPerNumber, statistics: shouldCalculateStats } = this.cli.parse(args);

        this.logger.log(`Reading the car numbers file '${input}'...`);
        const carNumbers = this.carNumbersReader.read(input);
        this.logger.log(`Number of input car numbers: ${carNumbers.length}`);

        this.logger.log(`Reading the dictionary file '${dictionary}'...`);
        const dict = this.dictionaryReader.read(dictionary);
        const dictKeys = Object.keys(dict);
        this.logger.log(`Number of dictionary keys: ${dictKeys.length}`);

        this.logger.log(`Parse the pattern '${pattern}'...`);
        const facetConfigs = this.patternParser.parse(pattern);

        this.logger.log('Generating voiceovers...');
        const facetMap = this.facetsGenerator.generate(carNumbers, facetConfigs, dictKeys);
        const voiceovers = this.generator.generate(facetMap, dict, countPerNumber);

        if (shouldCalculateStats) {
            this.statisticsReporter.report(voiceovers, facetMap, dict);
        }

        this.exporter.export(output, voiceovers);

        this.logger.log(`Number of generated voiceovers: ${voiceovers.length}`);
        this.logger.log(`You can find the result in the file: ${output}`);
        this.logger.log(`Time spent: ${Date.now() - startTime} ms`);
    }
}