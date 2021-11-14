import { Voiceover } from '../entities/voiceover';
import { CarNumber } from '../../common/entities/car-number';
import { VoiceoverDictionary } from '../entities/voiceover-dictionary';

export class Generator {

    generate(carNumbers: CarNumber[], dictionary: VoiceoverDictionary): Voiceover[] {
        // eslint-disable-next-line no-console
        console.log(carNumbers, dictionary);
        return [];
    }
}