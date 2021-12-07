import { Voiceover, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { RealFacet, RealFacetMap, RealFacetValue } from '../facets-generator/real-facet';
import { GeneratingOptions } from './generating-options';
import { Combinator } from '../../common/combinator/combinator';
import { Shuffler } from '../../common/shuffler/shuffler';

export class Generator {

    generate(facetMap: RealFacetMap, dictionary: VoiceoverDictionary, options: GeneratingOptions): Voiceover[] {
        const { isQuirkMode } = options;
        const facetDictionary = this.generateFacetDictionary(facetMap, dictionary, isQuirkMode);
        const restFacetDictionary = this.deepCopy(facetDictionary);

        return Array.from(facetMap.entries()).flatMap(([carNumber, facets]) => {
            return this.generateRequestedCount(carNumber, facets, facetDictionary, restFacetDictionary, options);
        });
    }

    private generateRequestedCount(
        name: string,
        facets: RealFacet[],
        facetDictionary: FacetDictionary,
        restFacetDictionary: FacetDictionary,
        generatingOptions: GeneratingOptions
    ): Voiceover[] {
        const { countPerNumber } = generatingOptions;
        const options: VoiceoverOption[] = [];
        while (options.length < countPerNumber) {
            const disjointFacetOptions = facets.filter(({ value }) => restFacetDictionary[value])
                .flatMap(({ value }) => {
                    if (!restFacetDictionary[value].length) {
                        // eslint-disable-next-line no-param-reassign
                        restFacetDictionary[value] = this.deepCopy(facetDictionary[value]);
                    }
                    return restFacetDictionary[value].shift();
                });

            const option = disjointFacetOptions.join(' ');

            const reachedTheLimitOfCombinations = options.includes(option);
            if (reachedTheLimitOfCombinations) {
                break;
            }

            options.push(option);
        }

        return options.map(option => ({ name, options: [option] }));
    }

    private generateFacetDictionary(
        facetMap: RealFacetMap,
        dictionary: VoiceoverDictionary,
        isQuirkMode = false
    ): FacetDictionary {
        const combinator = new Combinator();
        const shuffler = new Shuffler();
        const entries = Array.from(facetMap.values()).flat()
            .filter(facet => facet.keySets.length)
            .map(({ value, keySets }) => {
                const options = keySets.flatMap(keySet => {
                    const atomicOptions = keySet.map(key => dictionary[key]);
                    if (isQuirkMode) {
                        const allPossibleOptions = combinator.cartesianProduct(atomicOptions)
                            .map(combination => combination.join(' '));
                        return shuffler.shuffle(allPossibleOptions);
                    }
                    return this.mixIndependently(atomicOptions);
                });
                return [value, options] as [RealFacetValue, VoiceoverOption[]];
            });
        return Object.fromEntries(entries);
    }

    private mixIndependently(facetOptions: VoiceoverOption[][]): VoiceoverOption[] {
        const maxLength = facetOptions.reduce((max, options) => Math.max(max, options.length), 0);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            result.push(facetOptions.map(options => options[i % options.length]).flat());
        }

        return result.map(options => options.join(' '));
    }

    // noinspection JSMethodCanBeStatic
    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}

type FacetDictionary = Record<RealFacetValue, VoiceoverOption[]>;