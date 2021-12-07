import { Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { RealFacet, RealFacetMap } from '../facets-generator/real-facet';
import { GeneratingOptions } from './generating-options';

export class Generator {

    generate(facetMap: RealFacetMap, dictionary: VoiceoverDictionary, options: GeneratingOptions): Voiceover[] {
        const restDictionary = this.deepCopy(dictionary);
        return Array.from(facetMap.entries()).flatMap(([carNumber, facets]) => {
            return this.generateRequestedCount(carNumber, facets, dictionary, restDictionary, options);
        });
    }

    private generateRequestedCount(
        name: string,
        facets: RealFacet[],
        dictionary: VoiceoverDictionary,
        restDictionary: VoiceoverDictionary,
        generatingOptions: GeneratingOptions
    ): Voiceover[] {
        const { countPerNumber, isQuirkMode } = generatingOptions;
        const options: VoiceoverOption[] = [];
        while (options.length < countPerNumber) {
            const keysToShift = new Set<VoiceoverKey>();
            const disjointFacetOptions = facets.filter(facet => facet.keySets.length)
                .flatMap(({ keySets }) => {
                    let firstExistingKeySet = keySets.find(keySet => {
                        return keySet.every(key => restDictionary[key] && restDictionary[key].length);
                    });

                    if (!firstExistingKeySet) {
                        firstExistingKeySet = keySets[0];
                        firstExistingKeySet.filter(key => !restDictionary[key] || !restDictionary[key].length)
                            // eslint-disable-next-line no-param-reassign
                            .forEach(key => restDictionary[key] = this.deepCopy(dictionary[key]));
                    }

                    return firstExistingKeySet.map(key => {
                        if (!isQuirkMode) {
                            keysToShift.add(key);
                            return restDictionary[key][0];
                        }
                        return restDictionary[key].shift();
                    });
                });

            keysToShift.forEach(key => restDictionary[key].shift());

            const option = disjointFacetOptions.join(' ');

            const reachedTheLimitOfCombinations = options.includes(option);
            if (reachedTheLimitOfCombinations) {
                break;
            }

            options.push(option);
        }

        return options.map(option => ({ name, options: [option] }));
    }

    // noinspection JSMethodCanBeStatic
    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}