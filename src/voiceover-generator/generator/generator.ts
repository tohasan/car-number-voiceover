import { DisjointVoiceover, Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { VoiceoverFacetSet } from '../entities/voiceover-facet';
import { Combinator } from '../../common/combinator/combinator';
import { CarNumber } from '../../common/entities/car-number';
import { HigherOrderFacet } from '../../common/entities/facet';

export class Generator {
    private combinator = new Combinator();

    generate(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary, countPerKey?: number): Voiceover[] {
        if (!countPerKey) {
            return this.generateRepresentativeSet(keySets, dictionary);
        }

        return this.generateRequestedCount(keySets, dictionary, countPerKey);
    }

    private generateRepresentativeSet(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): Voiceover[] {
        const disjointVoiceovers = this.generateDisjointSet(keySets, dictionary);
        return this.joinVoiceoverOptions(disjointVoiceovers);
    }

    private generateRequestedCount(
        keySets: VoiceoverKey[][],
        dictionary: VoiceoverDictionary,
        countPerKey: number
    ): Voiceover[] {
        let restDictionary = dictionary;
        const keySetsGroupedByName = this.groupAllByName(keySets);
        return Array.from(keySetsGroupedByName.entries()).flatMap(([_, sets]) => {
            let reachableSets = this.filterByExistingKeys(sets, restDictionary);
            if (!this.canReachRequiredCount(reachableSets, restDictionary, countPerKey)) {
                reachableSets = sets;
                restDictionary = dictionary;
            }

            const maxSet = this.generateDisjointSet(reachableSets, restDictionary, countPerKey);
            const sliceCount = Math.min(maxSet.length, countPerKey);
            const disjointVoiceovers = maxSet.slice(0, sliceCount);
            restDictionary = this.thinOutDictionary(restDictionary, disjointVoiceovers);

            return this.joinVoiceoverOptions(disjointVoiceovers);
        });
    }

    // noinspection JSMethodCanBeStatic
    private joinVoiceoverOptions(disjointVoiceovers: DisjointVoiceover[]): Voiceover[] {
        return disjointVoiceovers.map(({ name, options }) => ({
            name,
            options: options.map(option => option.join(' '))
        }));
    }

    private generateDisjointSet(
        keySets: VoiceoverKey[][],
        dictionary: VoiceoverDictionary,
        requestedCount?: number
    ): DisjointVoiceover[] {
        return keySets.flatMap(keySet => {
            const name = keySet.join('');
            const higherOrderFacets = this.convertToHigherOrderFacets(keySet, dictionary);

            return this.combinator.generateRequestedCount(higherOrderFacets, requestedCount)
                .map(set => ({ name, options: [set] }));
        });
    }

    private convertToHigherOrderFacets(keySet: VoiceoverKey[], dictionary: VoiceoverDictionary): HigherOrderFacet[] {
        const facetGroups = this.getFacetByKeys(keySet, dictionary);
        return this.combinator.generateHigherOrderFacets(facetGroups);
    }

    private getFacetByKeys(keySet: VoiceoverKey[], dictionary: VoiceoverDictionary): VoiceoverFacetSet[] {
        return keySet.map(key => [dictionary[key]]);
    }

    private groupAllByName(keySets: VoiceoverKey[][]): Map<CarNumber, VoiceoverKey[][]> {
        const keySetsGroupedByName = new Map<string, VoiceoverKey[][]>();
        keySets.forEach(keySet => {
            const name = keySet.join('');
            const sets = keySetsGroupedByName.get(name) || [];
            sets.push(keySet);
            keySetsGroupedByName.set(name, sets);
        });

        return keySetsGroupedByName;
    }

    private canReachRequiredCount(
        keySets: VoiceoverKey[][],
        dictionary: VoiceoverDictionary,
        countPerKey: number
    ): boolean {
        const maxCount = keySets.map(keySet => this.convertToHigherOrderFacets(keySet, dictionary))
            .reduce((count, facets) => count + this.combinator.calculateCombinationsLimit(facets), 0);
        return countPerKey <= maxCount;
    }

    private filterByExistingKeys(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): VoiceoverKey[][] {
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