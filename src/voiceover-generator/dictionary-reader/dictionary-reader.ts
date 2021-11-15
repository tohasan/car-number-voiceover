import { VoiceoverDictionary } from '../entities/voiceover-dictionary';
import fs from 'fs';
import { EOL } from 'os';
import { Voiceover } from '../entities/voiceover';

export class DictionaryReader {
    private FIELD_SEPARATOR = ';';
    private OPTIONS_SEPARATOR = /\s*,\s*/;

    read(filename: string): VoiceoverDictionary {
        const content = fs.readFileSync(filename, 'utf8');
        const rows = content.split(EOL);

        const voiceoverEntries = rows.map(row => {
            const [name, optionsStr] = row.split(this.FIELD_SEPARATOR);
            // We need trim because of Zero Width No-Break Space (BOM, ZWNBSP)
            // accidentally occurred in a file
            // We should not trim all the spaces because key might be a space
            const normalizedName = name ? name.trim() || ' ' : name;
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