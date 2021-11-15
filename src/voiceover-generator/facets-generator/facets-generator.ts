import { CarNumber } from '../../common/entities/car-number';
import { VoiceoverKey } from '../entities/voiceover';

export class FacetsGenerator {
    private NOT_FOUND_KEY = 'undefined';

    generate(carNumbers: CarNumber[], voiceoverKeys: VoiceoverKey[]): VoiceoverKey[][] {
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
}