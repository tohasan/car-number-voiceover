import { KeySet, Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { RealFacet, RealFacetMap, RealFacetValue } from '../facets-generator/real-facet';
import { GeneratingOptions } from './generating-options';

export class Generator {

    generate(facetMap: RealFacetMap, dictionary: VoiceoverDictionary, options: GeneratingOptions): Voiceover[] {
        const facetDictionary = this.generateFacetDictionary(facetMap);
        const restDictionary = this.deepCopy(dictionary);
        const restFacetDictionary = this.deepCopy(facetDictionary);

        return Array.from(facetMap.entries()).flatMap(([carNumber, facets]) => {
            return this.generateRequestedCount(
                carNumber,
                facets,
                dictionary,
                restDictionary,
                facetDictionary,
                restFacetDictionary,
                options
            );
        });
    }

    private generateRequestedCount(
        name: string,
        facets: RealFacet[],
        dictionary: VoiceoverDictionary,
        restDictionary: VoiceoverDictionary,
        facetDictionary: FacetDictionary,
        restFacetDictionary: FacetDictionary,
        generatingOptions: GeneratingOptions
    ): Voiceover[] {
        const { countPerNumber, isQuirkMode } = generatingOptions;
        const options: VoiceoverOption[] = [];
        while (options.length < countPerNumber) {
            const keysToShift = new Set<VoiceoverKey>();
            const keySetsToShift = new Map<RealFacetValue, KeySet>();
            const disjointFacetOptions = facets.filter(({ value }) => restFacetDictionary[value])
                .flatMap(({ value }) => {
                    const keySets = restFacetDictionary[value];
                    let keySet = keySets.find(set => {
                        return set.every(key => restDictionary[key] && restDictionary[key].length);
                    });

                    if (!keySet) {
                        keySet = keySets[0];
                        keySet.filter(key => !restDictionary[key] || !restDictionary[key].length)
                            // eslint-disable-next-line no-param-reassign
                            .forEach(key => restDictionary[key] = this.deepCopy(dictionary[key]));
                    }

                    keySetsToShift.set(value, keySet);
                    return keySet.map(key => {
                        if (!isQuirkMode) {
                            keysToShift.add(key);
                            return restDictionary[key][0];
                        }
                        return restDictionary[key].shift();
                    });
                });

            keysToShift.forEach(key => restDictionary[key].shift());
            this.rebalanceFacetDictionary(restFacetDictionary, facetDictionary, facets, keySetsToShift, restDictionary);

            const option = disjointFacetOptions.join(' ');

            const reachedTheLimitOfCombinations = options.includes(option);
            if (reachedTheLimitOfCombinations) {
                break;
            }

            options.push(option);
        }

        return options.map(option => ({ name, options: [option] }));
    }

    private generateFacetDictionary(facetMap: RealFacetMap): FacetDictionary {
        const entries = Array.from(facetMap.values()).flat()
            .filter(facet => facet.keySets.length)
            .map(({ value, keySets }) => [value, keySets] as [RealFacetValue, KeySet[]]);
        return Object.fromEntries(entries);
    }

    private rebalanceFacetDictionary(
        restDictionary: FacetDictionary,
        dictionary: FacetDictionary,
        facets: RealFacet[],
        keySetsToShift: Map<RealFacetValue, KeySet>,
        voiceoverDictionary: VoiceoverDictionary
    ): FacetDictionary {
        facets.filter(({ value }) => restDictionary[value])
            .forEach(({ value }) => {
                const keySet = keySetsToShift.get(value)!;
                const isEmpty = keySet.every(key => !voiceoverDictionary[key] || !voiceoverDictionary[key].length);
                if (!isEmpty) {
                    return;
                }

                const index = restDictionary[value].indexOf(keySet);
                // eslint-disable-next-line no-param-reassign
                restDictionary[value].splice(index, 1);

                if (!restDictionary[value].length) {
                    // eslint-disable-next-line no-param-reassign
                    restDictionary[value] = this.deepCopy(dictionary[value]);
                }
            });

        return restDictionary;
    }

    // noinspection JSMethodCanBeStatic
    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}

type FacetDictionary = Record<RealFacetValue, KeySet[]>;