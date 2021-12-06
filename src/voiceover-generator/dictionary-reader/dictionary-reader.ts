import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import { Voiceover } from '../entities/voiceover';
import { FileReader } from '../file-reader/file-reader';

export class DictionaryReader {
    private FIELD_SEPARATOR = ';';
    private OPTIONS_SEPARATOR = /\s*,\s*/;

    private fileReader = new FileReader();

    read(filename: string): VoiceoverDictionary {
        const rows = this.fileReader.read(filename);

        const voiceoverEntries = rows.map(row => {
            const [name, optionsStr] = row.split(this.FIELD_SEPARATOR);
            // We need trim because of Zero Width No-Break Space (BOM, ZWNBSP, U+200B)
            // accidentally occurred in a file
            // But we should not trim visible spaces because
            // they might be used as a part of key for mapping a special
            // translation options
            const normalizedName = name.replace(/[\u200B-\u200D\uFEFF]/g, '');
            return [normalizedName, (optionsStr || '').trim()];
        });

        const voiceovers: Voiceover[] = voiceoverEntries
            .filter(([name, optionsStr]) => Boolean(name) && Boolean(optionsStr))
            .map(([name, optionsStr]) => {
                const options = optionsStr.split(this.OPTIONS_SEPARATOR);
                return { name, options };
            });

        const dictionary = {} as VoiceoverDictionary;
        voiceovers.forEach(voiceover => dictionary[voiceover.name] = voiceover.options);
        return dictionary;
    }
}