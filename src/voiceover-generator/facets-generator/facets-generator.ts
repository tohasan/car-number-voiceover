import { CarNumber } from '../../common/entities/car-number';
import { KeySet } from '../entities/voiceover';
import { Logger } from '../../common/utils/logger/logger';
import { Combinator } from '../../common/combinator/combinator';
import { FacetConfig } from '../pattern-parser/facet-config';
import { RealFacet, RealFacetMap } from './real-facet';

export class FacetsGenerator {
    private logger = new Logger();
    private combinator = new Combinator();

    generate(carNumbers: CarNumber[], facetConfigs: FacetConfig[], voiceoverKeys: KeySet): RealFacetMap {
        this.warnAboutAbsentCharacters(carNumbers, voiceoverKeys);

        const entries = carNumbers.map(carNumber => {
            const numberKeysSubset = this.filterOutKeysIfNotPresent(voiceoverKeys, carNumber);
            let restNumber = carNumber;
            const facets: RealFacet[] = facetConfigs.map(config => {
                const facetStr = restNumber.substr(0, config.length);
                restNumber = restNumber.substr(config.length);
                const keysSubset = this.filterOutKeysIfNotPresent(numberKeysSubset, facetStr);
                const keyFacetsPerPos = this.generateFacetsPerPosition(facetStr, keysSubset);
                const keySets = this.combinator.cartesianProductWithOverlapping(keyFacetsPerPos);
                return { config, value: facetStr, keySets: this.orderKeySetsByTheMostLongKey(keySets) };
            });
            return [carNumber, facets] as [CarNumber, RealFacet[]];
        });

        return new Map(entries);
    }

    private filterOutKeysIfNotPresent(voiceoverKeys: KeySet, facetStr: string): KeySet {
        return voiceoverKeys.filter(key => facetStr.includes(key));
    }

    private generateFacetsPerPosition(facetStr: string, keys: KeySet): KeySet[] {
        const chars = facetStr.split('');
        const facets: KeySet[] = chars.map(() => []);

        keys.forEach(key => {
            const indexes = Array.from(facetStr.matchAll(new RegExp(`(?=(${key}))`, 'g'))).map(match => match.index!);
            indexes.forEach(index => facets[index].push(key));
        });
        return facets;
    }

    private orderKeySetsByTheMostLongKey(keySets: KeySet[]): KeySet[] {
        const orderedKeySets = [...keySets];
        orderedKeySets.sort((ks1, ks2) => {
            const lengths = [ks1, ks2].map(keySet => {
                return keySet.map(key => key.length)
                    .reduce((max, current) => Math.max(max, current), 0);
            });
            const [maxLength1, maxLength2] = lengths;
            const [maxKeyIndex1, maxKeyIndex2] = [ks1, ks2].map((keySet, index) => {
                return keySet.findIndex(key => key.length === lengths[index])!;
            });
            return maxLength2 - maxLength1
                || ks1.length - ks2.length
                || maxKeyIndex1 - maxKeyIndex2;
        });
        return orderedKeySets;
    }

    private warnAboutAbsentCharacters(carNumbers: CarNumber[], voiceoverKeys: KeySet): void {
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