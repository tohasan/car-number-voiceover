import { Voiceover, VoiceoverKey, VoiceoverOption } from '../entities/voiceover';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { VoiceoverFacetSet } from '../entities/voiceover-facet';
import { Combinator } from '../../common/combinator/combinator';

export class Generator {
    private combinator = new Combinator();

    generate(keySets: VoiceoverKey[][], dictionary: VoiceoverDictionary, countPerKey?: number): Voiceover[] {
        const voiceovers = keySets.flatMap(keySet => {
            const name = keySet.join('');
            const facetGroups = this.getFacetByKeys(keySet, dictionary);
            const higherOrderFacets = this.combinator.generateHigherOrderFacets(facetGroups);

            return this.combinator.mixIndependently(higherOrderFacets)
                .map(set => ({ name, options: [set.join(' ')] }));
        });

        return this.sliceRequestedCount(voiceovers, countPerKey);
    }

    private getFacetByKeys(keySet: VoiceoverKey[], dictionary: VoiceoverDictionary): VoiceoverFacetSet[] {
        return keySet.map(key => [dictionary[key]]);
    }

    private sliceRequestedCount(voiceovers: Voiceover[], countPerKey?: number): Voiceover[] {
        const voiceversGroupedByName = new Map<string, VoiceoverOption[]>();
        voiceovers.forEach(voiceover => {
            const options = voiceversGroupedByName.get(voiceover.name) || [] as VoiceoverOption[];
            const resultOptions = [...options, ...voiceover.options];
            voiceversGroupedByName.set(voiceover.name, resultOptions);
        });
        const voiceoverEntries = Array.from(voiceversGroupedByName.entries()).map(([key, options]) => {
            const count = Math.min(options.length, countPerKey || options.length);
            return [key, options.slice(0, count)] as [string, VoiceoverOption[]];
        });

        return voiceoverEntries.flatMap(([key, options]) => {
            return options.map(option => ({ name: key, options: [option] } as Voiceover));
        });
    }
}