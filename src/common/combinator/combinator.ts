import { Facet } from '../entities/facet';
import { DisjointCombination } from '../entities/disjoint-combination';

export class Combinator {

    cartesianProduct(facets: Facet[]): DisjointCombination[] {
        return facets.reduce<DisjointCombination[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }
}