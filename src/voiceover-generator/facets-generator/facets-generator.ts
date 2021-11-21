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
            const sets = this.findKeySets(normalizedCarNumber, voiceoverKeys);
            return sets.filter(set => set.every(key => this.NOT_FOUND_KEY !== key));
        });
    }

    private filterOutCharsIfNotPresentInKeys(carNumber: CarNumber, voiceoverKeys: VoiceoverKey[]): CarNumber {
        const chars = carNumber.split('');
        const normalizedChars = chars.filter(char => voiceoverKeys.some(key => key.includes(char)));
        return normalizedChars.join('');
    }

    private findKeySets(str: string, voiceoverKeys: VoiceoverKey[]): VoiceoverKey[][] {
        if (!str) {
            return [];
        }

        let result: VoiceoverKey[][] = [];
        for (let i = 1; i <= str.length; i++) {
            const key = str.substring(0, i);
            const trailKeysSet = this.findKeySets(str.substring(i, str.length), voiceoverKeys);
            const resultKey = voiceoverKeys.includes(key) ? key : this.NOT_FOUND_KEY;
            if (trailKeysSet.length) {
                result = [
                    ...result,
                    ...trailKeysSet.map(trailKeys => [resultKey, ...trailKeys])
                ];
            } else {
                result = [...result, [resultKey]];
            }
        }

        return result;
    }

    private warnAboutAbsentCharacters(carNumbers: CarNumber[], voiceoverKeys: VoiceoverKey[]): void {
        this.logger.log('WARN The following characters are not found in any dictionary key:');
        const notFoundChars = carNumbers.flatMap(carNumber => {
            const chars = carNumber.split('');
            return chars.filter(char => voiceoverKeys.every(key => !key.includes(char)));
        });
        const uniqueChars = Array.from(new Set(notFoundChars));
        uniqueChars.forEach(char => {
            this.logger.log(`  ${char} [${this.charToHex(char)}]`);
        });
    }

    // noinspection JSMethodCanBeStatic
    private charToHex(char: string): string {
        return `0x${`0000${char.charCodeAt(0).toString(16)}`.substr(-4)}`;
    }
}