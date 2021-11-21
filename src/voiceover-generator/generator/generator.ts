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

        let restDictionary = dictionary;
        const keySetsGroupedByName = this.groupAllByName(keySets);
        return Array.from(keySetsGroupedByName.entries()).flatMap(([_, sets]) => {
            if (!this.canReachRequiredCount(sets, restDictionary, countPerKey)) {
                restDictionary = dictionary;
            }

            const representativeSet = this.generateRepresentativeDisjointSet(sets, restDictionary);
            const sliceCount = Math.min(representativeSet.length, countPerKey);
            const disjointVoiceovers = representativeSet.slice(0, sliceCount);
            restDictionary = this.thinOutDictionary(restDictionary, disjointVoiceovers);

            return this.joinVoiceoverOptions(disjointVoiceovers);
        });
    }

    private generateRepresentativeSet(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): Voiceover[] {
        const disjointVoiceovers = this.generateRepresentativeDisjointSet(keySets, dictionary);
        return this.joinVoiceoverOptions(disjointVoiceovers);
    }

    // noinspection JSMethodCanBeStatic
    private joinVoiceoverOptions(disjointVoiceovers: DisjointVoiceover[]): Voiceover[] {
        return disjointVoiceovers.map(({ name, options }) => ({
            name,
            options: options.map(option => option.join(' '))
        }));
    }

    private generateRepresentativeDisjointSet(
        keySets: VoiceoverKey[][],
        dictionary: VoiceoverDictionary
    ): DisjointVoiceover[] {
        return keySets.flatMap(keySet => {
            const name = keySet.join('');
            const higherOrderFacets = this.convertToHigherOrderFacets(keySet, dictionary);

            return this.combinator.mixIndependently(higherOrderFacets)
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
        const representativeCount = keySets.map(keySet => this.convertToHigherOrderFacets(keySet, dictionary))
            .reduce((count, facets) => count + this.combinator.calculateRepresentativeCount(facets), 0);
        return countPerKey <= representativeCount;
    }

    private thinOutDictionary(
        dictionary: VoiceoverDictionary,
        disjointVoiceovers: DisjointVoiceover[]
    ): VoiceoverDictionary {
        const voiceoverValues = disjointVoiceovers.flatMap(({ options }) => options.flat());
        const valueSet = new Set<VoiceoverOption>(voiceoverValues);
        const filteredEntries = Object.entries(dictionary)
            .map(([key, values]) => [key, values.filter(value => !valueSet.has(value))]);
        return Object.fromEntries(filteredEntries);
    }
}