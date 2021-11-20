import { Facet, HigherOrderFacet } from '../entities/facet';
import { DisjointCombination } from '../entities/disjoint-combination';
import { FacetUtils } from '../utils/facet-utils/facet.utils';

// TODO: add specs
export class Combinator {

    cartesianProduct(facets: Facet[]): DisjointCombination[] {
        return facets.reduce<DisjointCombination[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }

    mixIndependently(facets: HigherOrderFacet[], offset: number = 0): DisjointCombination[] {
        const maxLength = FacetUtils.getMaxLength(facets);
        const offsets = this.calculateOffsetPerFacet(facets, offset);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            result.push(facets.map((facet, index) => facet[(i + offsets[index]) % facet.length]).flat());
        }

        return result;
    }

    generateHigherOrderFacets(facetGroups: Facet[][]): HigherOrderFacet[] {
        return facetGroups.map(facetGroup => this.cartesianProduct(facetGroup));
    }

    // noinspection JSMethodCanBeStatic
    private calculateOffsetPerFacet(facets: HigherOrderFacet[], offset: number): number[] {
        const maxLength = FacetUtils.getMaxLength(facets);

        const reversedFacets = [...facets].reverse();
        const offsetsPerFacet: number[] = new Array(facets.length).fill(0);
        let isOneMaxPositionSkipped = false;
        for (let restOffset = offset, i = 0; Boolean(restOffset); i++) {
            const facet = reversedFacets[i];

            if (!isOneMaxPositionSkipped && facet.length === maxLength) {
                isOneMaxPositionSkipped = true;
                continue;
            }

            offsetsPerFacet[i] = restOffset % facet.length;
            restOffset = Math.floor(restOffset / facet.length);
        }

        return offsetsPerFacet.reverse();
    }
}