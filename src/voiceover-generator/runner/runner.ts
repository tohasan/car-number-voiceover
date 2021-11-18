import { CsvExporter } from '../csv-exporter/csv-exporter';
import { Generator } from '../generator/generator';
import { DictionaryReader } from '../dictionary-reader/dictionary-reader';
import { CarNumbersReader } from '../car-numbers-reader/car-numbers-reader';
import { GeneratorCli } from '../generator-cli/generator-cli';
import { FacetsGenerator } from '../facets-generator/facets-generator';
import { Logger } from '../../common/utils/logger/logger';

export class Runner {

    private readonly cli = new GeneratorCli();
    private readonly carNumbersReader = new CarNumbersReader();
    private readonly dictionaryReader = new DictionaryReader();
    private readonly facetsGenerator = new FacetsGenerator();
    private readonly generator = new Generator();
    private readonly exporter = new CsvExporter();
    private readonly logger = new Logger();

    run(args: string[]): void {
        const startTime = Date.now();

        const { input, dictionary, output } = this.cli.parse(args);
        const carNumbers = this.carNumbersReader.read(input);
        const dict = this.dictionaryReader.read(dictionary);
        const keySets = this.facetsGenerator.generate(carNumbers, Object.keys(dict));
        const voiceovers = this.generator.generate(keySets, dict);
        this.exporter.export(output, voiceovers);

        this.logger.log(`Number of input car numbers: ${carNumbers.length}`);
        this.logger.log(`Number of generated voiceovers: ${voiceovers.length}`);
        this.logger.log(`You can find the result in the file: ${output}`);
        this.logger.log(`Time spent: ${Date.now() - startTime} ms`);
    }
}