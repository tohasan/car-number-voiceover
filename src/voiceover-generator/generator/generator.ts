import { DisjointVoiceover, Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { VoiceoverFacetSet } from '../entities/voiceover-facet';
import { Combinator } from '../../common/combinator/combinator';
import { CarNumber } from '../../common/entities/car-number';
import { HigherOrderFacet } from '../../common/entities/facet';

export class Generator {
    private combinator = new Combinator();

    generate(keySets: KeySet[], dictionary: VoiceoverDictionary, countPerKey?: number): Voiceover[] {
        let restDictionary = dictionary;
        const keySetsGroupedByName = this.groupAllByName(keySets);
        const orderedKeySetsByTheMostLongKey = this.orderKeySetsByTheMostLongKey(keySetsGroupedByName);
        return Array.from(orderedKeySetsByTheMostLongKey.entries()).flatMap(([_, sets]) => {
            if (!countPerKey) {
                return this.generateRepresentativeSet(sets, dictionary);
            }

            const [voiceovers, dict] = this.generateRequestedCount(sets, dictionary, restDictionary, countPerKey);
            restDictionary = dict;
            return voiceovers;
        });
    }

    private generateRepresentativeSet(keySets: KeySet[], dictionary: VoiceoverDictionary): Voiceover[] {
        const disjointVoiceovers = this.generateDisjointSet(keySets, dictionary);
        return this.joinVoiceoverOptions(disjointVoiceovers);
    }

    private generateRequestedCount(
        keySets: KeySet[],
        dictionary: VoiceoverDictionary,
        originalRestDictionary: VoiceoverDictionary,
        countPerKey: number
    ): [Voiceover[], VoiceoverDictionary] {
        let restDictionary = Object.fromEntries(Object.entries(originalRestDictionary));
        let reachableSets = this.filterByExistingKeys(keySets, restDictionary);
        if (!this.canReachRequiredCount(reachableSets, restDictionary, countPerKey)) {
            reachableSets = keySets;
            restDictionary = dictionary;
        }

        const maxSet = this.generateDisjointSet(reachableSets, restDictionary, countPerKey);
        const sliceCount = Math.min(maxSet.length, countPerKey);
        const disjointVoiceovers = maxSet.slice(0, sliceCount);
        restDictionary = this.thinOutDictionary(restDictionary, disjointVoiceovers);

        return [this.joinVoiceoverOptions(disjointVoiceovers), restDictionary];
    }

    // noinspection JSMethodCanBeStatic
    private joinVoiceoverOptions(disjointVoiceovers: DisjointVoiceover[]): Voiceover[] {
        return disjointVoiceovers.map(({ name, options }) => ({
            name,
            options: options.map(option => option.join(' '))
        }));
    }

    private generateDisjointSet(
        keySets: KeySet[],
        dictionary: VoiceoverDictionary,
        requestedCount?: number
    ): DisjointVoiceover[] {
        return keySets.flatMap(keySet => {
            const name = keySet.join('');
            const higherOrderFacets = this.convertToHigherOrderFacets(keySet, dictionary);

            return this.combinator.generateRequestedCount(higherOrderFacets, { requestedCount })
                .map(set => ({ name, options: [set] }));
        });
    }

    private convertToHigherOrderFacets(keySet: KeySet, dictionary: VoiceoverDictionary): HigherOrderFacet[] {
        const facetGroups = this.getFacetByKeys(keySet, dictionary);
        return this.combinator.generateHigherOrderFacets(facetGroups);
    }

    private getFacetByKeys(keySet: KeySet, dictionary: VoiceoverDictionary): VoiceoverFacetSet[] {
        return keySet.map(key => [dictionary[key]]);
    }

    private groupAllByName(keySets: KeySet[]): KeySetsMap {
        const keySetsGroupedByName = new Map<string, KeySet[]>();
        keySets.forEach(keySet => {
            const name = keySet.join('');
            const sets = keySetsGroupedByName.get(name) || [];
            sets.push(keySet);
            keySetsGroupedByName.set(name, sets);
        });

        return keySetsGroupedByName;
    }

    private orderKeySetsByTheMostLongKey(keySetsMap: KeySetsMap): KeySetsMap {
        const entries = Array.from(keySetsMap.entries()).map(([carNumber, keySets]) => {
            const orderedKeySets = [...keySets];
            orderedKeySets.sort((ks1, ks2) => {
                const [maxLength1, maxLength2] = [ks1, ks2].map(keySet => {
                    return keySet.map(key => key.length)
                        .reduce((max, current) => Math.max(max, current), 0);
                });
                return maxLength2 - maxLength1
                    || ks1.length - ks2.length;
            });
            return [carNumber, orderedKeySets] as [CarNumber, KeySet[]];
        });
        return new Map(entries);
    }

    private canReachRequiredCount(
        keySets: KeySet[],
        dictionary: VoiceoverDictionary,
        countPerKey: number
    ): boolean {
        const maxCount = keySets.map(keySet => this.convertToHigherOrderFacets(keySet, dictionary))
            .reduce((count, facets) => count + this.combinator.calculateCombinationsLimit(facets), 0);
        return countPerKey <= maxCount;
    }

    private filterByExistingKeys(keySets: KeySet[], dictionary: VoiceoverDictionary): KeySet[] {
        return keySets.filter(keySet => keySet.every(key => dictionary[key]));
    }

    private thinOutDictionary(
        dictionary: VoiceoverDictionary,
        disjointVoiceovers: DisjointVoiceover[]
    ): VoiceoverDictionary {
        const voiceoverValues = disjointVoiceovers.flatMap(({ options }) => options.flat());
        const valueSet = new Set<VoiceoverOption>(voiceoverValues);
        const filteredEntries = Object.entries(dictionary)
            .map(([key, values]) => [key, values.filter(value => !valueSet.has(value))])
            .filter(([_, values]) => values.length);
        return Object.fromEntries(filteredEntries);
    }
}

type KeySet = VoiceoverKey[];
type KeySetsMap = Map<CarNumber, KeySet[]>;