import { Voiceover, VoiceoverKey } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { VoiceoverFacetSet } from '../entities/voiceover-facet';
import { Combinator } from '../../common/combinator/combinator';

export class Generator {
    private combinator = new Combinator();

    generate(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary): Voiceover[] {
        return keySets.flatMap(keySet => {
            const name = keySet.join('');
            const facets = this.getFacetByKeys(keySet, dictionary);
            return this.combinator.cartesianProduct(facets)
                .map(set => ({ name, options: [set.join(' ')] }));
        });
    }

    private getFacetByKeys(keySet: VoiceoverKey[], dictionary: VoiceoverDictionary): VoiceoverFacetSet {
        return keySet.map(key => dictionary[key]);
    }
}