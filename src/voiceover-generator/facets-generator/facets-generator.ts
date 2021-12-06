import { CarNumber } from '../../common/entities/car-number';
import { VoiceoverKey } from '../entities/voiceover';
import { Logger } from '../../common/utils/logger/logger';

export class FacetsGenerator {
    private NOT_FOUND_KEY = 'undefined';
    private logger = new Logger();

    generate(carNumbers: CarNumber[], voiceoverKeys: VoiceoverKey[]): VoiceoverKey[][] {
        this.warnAboutAbsentCharacters(carNumbers, voiceoverKeys);
        return carNumbers.flatMap(carNumber => {
            const normalizedCarNumber = this.filterOutCharsIfNotPresentInKeys(carNumber, voiceoverKeys);
            const keysSubset = this.filterOutKeysIfNotPresentInCarNumber(voiceoverKeys, normalizedCarNumber);
            const sets = this.findKeySets(normalizedCarNumber, keysSubset);
            return sets.filter(set => set.every(key => this.NOT_FOUND_KEY !== key));
        });
    }

    private filterOutCharsIfNotPresentInKeys(carNumber: CarNumber, voiceoverKeys: VoiceoverKey[]): CarNumber {
        const chars = carNumber.split('');
        const normalizedChars = chars.filter(char => voiceoverKeys.some(key => key.includes(char)));
        return normalizedChars.join('');
    }

    private filterOutKeysIfNotPresentInCarNumber(voiceoverKeys: VoiceoverKey[], carNumber: CarNumber): VoiceoverKey[] {
        return voiceoverKeys.filter(key => carNumber.includes(key));
    }

    private findKeySets(str: string, voiceoverKeys: VoiceoverKey[]): VoiceoverKey[][] {
        if (!str) {
            return [];
        }

        let result: VoiceoverKey[][] = [];
        for (let i = 1; i <= str.length; i++) {
            const key = str.substring(0, i);
            if (!voiceoverKeys.includes(key)) {
                return [...result, [this.NOT_FOUND_KEY]];
            }

            const trailKeysSet = this.findKeySets(str.substring(i, str.length), voiceoverKeys);

            if (trailKeysSet.length) {
                result = [
                    ...result,
                    ...trailKeysSet.map(trailKeys => [key, ...trailKeys])
                ];
            } else {
                result = [...result, [key]];
            }
        }

        return result;
    }

    private warnAboutAbsentCharacters(carNumbers: CarNumber[], voiceoverKeys: VoiceoverKey[]): void {
        const notFoundChars = carNumbers.flatMap(carNumber => {
            const chars = carNumber.split('');
            return chars.filter(char => voiceoverKeys.every(key => !key.includes(char)));
        });
        const uniqueChars = Array.from(new Set(notFoundChars));

        if (uniqueChars.length) {
            this.logger.log('WARN The following characters are not found in any dictionary key:');
            uniqueChars.forEach(char => {
                this.logger.log(`  ${char} [${this.charToHex(char)}]`);
            });
        }
    }

    // noinspection JSMethodCanBeStatic
    private charToHex(char: string): string {
        return `0x${`0000${char.charCodeAt(0).toString(16)}`.substr(-4)}`;
    }
}