export interface Voiceover {
    name: VoiceoverKey;
    options: VoiceoverOption[];
}

export interface DisjointVoiceover {
    name: VoiceoverKey;
    options: DisjointOption[];
}

export type VoiceoverKey = string;
export type VoiceoverOption = string;
export type DisjointOption = string[];