import { CarNumber } from '../../common/entities/car-number';
import { Facet, FacetValue } from '../entities/facet';

export class Generator {

    generate(facets: Facet[]): CarNumber[] {
        return this.cartesianProduct(facets)
            .map(set => set.join(''));
    }

    private cartesianProduct(facets: Facet[]): DisjointCardNumber[] {
        return facets.reduce<DisjointCardNumber[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }
}

type DisjointCardNumber = FacetValue[];