import { Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { Logger } from '../../common/utils/logger/logger';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';

export class StatisticsReporter {
    private FULL_UTILIZATION = 1;
    private logger = new Logger();

    report(voiceovers: Voiceover[], keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): void {
        this.logger.log('');
        this.logger.log('-----------');
        this.logger.log('Statistics:');

        const uniqueKeys = this.calculateUsedKeys(keySets);
        this.logger.log('Used keys:');
        this.logger.log(uniqueKeys.join(', '));

        const keysUtilizationMap = this.calculateKeysUtilization(voiceovers, uniqueKeys, dictionary);
        this.logger.log('Keys utilization:');
        const notUtilizedKeys = Array.from(keysUtilizationMap.entries())
            .filter(([_, utilization]) => utilization < this.FULL_UTILIZATION);
        if (notUtilizedKeys.length) {
            notUtilizedKeys.forEach(([key, utilization]) => {
                this.logger.log(`  ${key}: ${`  ${Math.floor(utilization * 100)}`.substr(-2)}%`);
            });
            this.logger.log('Other keys are fully utilized.');
        } else {
            this.logger.log('All keys are fully utilized.');
        }

        this.logger.log('-----------');
        this.logger.log('');
    }

    // noinspection JSMethodCanBeStatic
    private calculateUsedKeys(keySets: VoiceoverKey[][]): VoiceoverKey[] {
        return Array.from(new Set(keySets.flat()));
    }

    private calculateKeysUtilization(
        voiceovers: Voiceover[],
        keys: VoiceoverKey[],
        dictionary: VoiceoverDictionary
    ): Map<VoiceoverKey, UtilizationPercent> {
        const keySet = new Set(keys);
        const allVoiceoverOptions: VoiceoverOption[] = voiceovers.flatMap(({ options }) => options);
        const dictionaryEntriesWithUsedKeys = Object.entries(dictionary)
            .filter(([key]) => keySet.has(key));
        const dictionaryEntriesWithUsedValues = dictionaryEntriesWithUsedKeys.map(([key, values]) => {
            const filteredValues = values.filter(value => {
                return allVoiceoverOptions.some(option => {
                    return option.includes(` ${value}`)
                        || option.includes(`${value} `)
                        || option === value;
                });
            });
            return [key, filteredValues];
        });
        return new Map(dictionaryEntriesWithUsedKeys.map(([key, values], index) => {
            const [, usedValues] = dictionaryEntriesWithUsedValues[index];
            return [key, usedValues.length / values.length];
        }));
    }
}

type UtilizationPercent = number;