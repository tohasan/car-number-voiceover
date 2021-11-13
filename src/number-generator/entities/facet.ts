export type LetterChar = string;
export type DigitChar = string;
export type SpaceChar = string;
export type NumericString = string;
export type FacetRange = string;
export type FacetValue = LetterChar | DigitChar | SpaceChar | NumericString | FacetRange;
export type Facet = FacetValue[];