import { FacetConfig } from '../pattern-parser/facet-config';
import { KeySet } from '../entities/voiceover';
import { CarNumber } from '../../common/entities/car-number';

export interface RealFacet {
    config: FacetConfig;
    keySets: KeySet[];
}

export type RealFacetMap = Map<CarNumber, RealFacet[]>;