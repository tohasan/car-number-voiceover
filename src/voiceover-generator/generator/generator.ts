import { Voiceover, VoiceoverKey } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { VoiceoverFacetSet } from '../entities/voiceover-facet';
import { Facet } from '../../common/entities/facet';
import { DisjointCombination } from '../../common/entities/disjoint-combination';

export class Generator {

    generate(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): Voiceover[] {
        return keySets.flatMap(keySet => {
            const name = keySet.join('');
            const facets = this.getFacetByKeys(keySet, dictionary);
            return this.cartesianProduct(facets)
                .map(set => ({ name, options: [set.join(' ')] }));
        });
    }

    private getFacetByKeys(keySet: VoiceoverKey[], dictionary: VoiceoverDictionary): VoiceoverFacetSet {
        return keySet.map(key => dictionary[key]);
    }

    private cartesianProduct(facets: Facet[]): DisjointCombination[] {
        return facets.reduce<DisjointCombination[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }
}