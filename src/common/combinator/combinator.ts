import { Facet, HigherOrderFacet } from '../entities/facet';
import { DisjointCombination } from '../entities/disjoint-combination';
import { FacetUtils } from '../utils/facet-utils/facet.utils';
import { GeneratingOptions } from './generating-options';
import { Shuffler } from '../shuffler/shuffler';

// TODO: add specs
export class Combinator {
    private readonly shuffler = new Shuffler<DisjointCombination>();

    cartesianProduct(facets: Facet[]): DisjointCombination[] {
        return facets.reduce<DisjointCombination[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }

    // TODO: It might be private (need to rethink classes)
    mixIndependently(facets: HigherOrderFacet[], offset: number): DisjointCombination[] {
        const maxLength = FacetUtils.getMaxLength(facets);
        const offsets = this.calculateOffsetPerFacet(facets, offset);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            result.push(facets.map((facet, index) => facet[(i + offsets[index]) % facet.length]).flat());
        }

        return result;
    }

    generateRequestedCount(facets: HigherOrderFacet[], options: GeneratingOptions): DisjointCombination[] {
        const maxCount = this.calculateCombinationsLimit(facets);
        const representativeCount = this.calculateRepresentativeCount(facets);
        const { needToShuffle, requestedCount } = options;
        const count = requestedCount ?? representativeCount;
        const maxOffset = Math.min(maxCount, count) / representativeCount;

        let resultSet: DisjointCombination[] = [];

        for (let offset = 0; offset < maxOffset; offset++) {
            const subset = this.mixIndependently(facets, offset);
            resultSet = [...resultSet, ...subset];
        }

        if (needToShuffle) {
            resultSet = this.shuffler.shuffle(resultSet);
        }

        return resultSet.slice(0, count);
    }

    generateHigherOrderFacets(facetGroups: Facet[][]): HigherOrderFacet[] {
        return facetGroups.map(facetGroup => this.cartesianProduct(facetGroup));
    }

    calculateCombinationsLimit(facets: HigherOrderFacet[]): number {
        return facets.reduce((count, facet) => count * facet.length, 1);
    }

    calculateRepresentativeCount(facets: HigherOrderFacet[]): number {
        return FacetUtils.getMaxLength(facets);
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