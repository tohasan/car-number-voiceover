import { CarNumber } from '../../common/entities/car-number';
import { VoiceoverKey } from '../entities/voiceover';
import { Logger } from '../../common/utils/logger/logger';
import { Combinator } from '../../common/combinator/combinator';

export class FacetsGenerator {
    private logger = new Logger();
    private combinator = new Combinator();

    generate(carNumbers: CarNumber[], voiceoverKeys: VoiceoverKey[]): VoiceoverKey[][] {
        this.warnAboutAbsentCharacters(carNumbers, voiceoverKeys);
        return carNumbers.flatMap(carNumber => {
            const normalizedCarNumber = this.filterOutCharsIfNotPresentInKeys(carNumber, voiceoverKeys);
            const keysSubset = this.filterOutKeysIfNotPresentInCarNumber(voiceoverKeys, normalizedCarNumber);
            const keyFacetsPerPos = this.generateFacetsPerPositionInCarNumber(normalizedCarNumber, keysSubset);
            return this.combinator.cartesianProductWithOverlapping(keyFacetsPerPos);
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

    private generateFacetsPerPositionInCarNumber(carNumber: CarNumber, keys: VoiceoverKey[]): VoiceoverKey[][] {
        const chars = carNumber.split('');
        const facets: VoiceoverKey[][] = chars.map(() => []);

        keys.forEach(key => {
            const indexes = Array.from(carNumber.matchAll(new RegExp(key, 'g'))).map(match => match.index!);
            indexes.forEach(index => facets[index].push(key));
        });
        return facets;
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