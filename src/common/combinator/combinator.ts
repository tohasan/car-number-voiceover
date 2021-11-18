import { Facet, FacetValue } from '../entities/facet';
import { DisjointCombination } from '../entities/disjoint-combination';

export class Combinator {
    private whiteRules: RangeRule[] = [
        { range: [10, 19], type: RangeMatchingType.INCLUDE }
    ];
    private blackRules: RangeRule[] = [
        { range: [0, 0], type: RangeMatchingType.EXACT }
    ];

    mix(facets: Facet[]): DisjointCombination[] {
        const facetGroups = this.groupSimilarFacets(facets);
        const higherOrderFacets = this.generateHigherOrderFacets(facetGroups);
        return this.makeMix(higherOrderFacets);
    }

    private groupSimilarFacets(facets: Facet[]): Facet[][] {
        const groups: Facet[][] = [];
        let group: Facet[] = [];
        for (const facet of facets) {
            if (!group.length) {
                group.push(facet);
                continue;
            }

            const isOnlyLetters = this.containsOnlyLetters(facet) && this.containsOnlyLetters(group[0]);
            if (isOnlyLetters) {
                group.push(facet);
                continue;
            }

            const isOnlyDigits = this.containsOnlyDigits(facet) && this.containsOnlyDigits(group[0]);
            if (isOnlyDigits) {
                group.push(facet);
                continue;
            }

            groups.push(group);
            group = [facet];
        }
        groups.push(group);

        return groups;
    }

    // noinspection JSMethodCanBeStatic
    private containsOnlyLetters(facet: Facet): boolean {
        return facet.every(value => /[a-zа-я]/i.test(value));
    }

    // noinspection JSMethodCanBeStatic
    private containsOnlyDigits(facet: Facet): boolean {
        return facet.every(value => /[0-9]/.test(value));
    }

    private generateHigherOrderFacets(facetGroups: Facet[][]): HigherOrderFacet[] {
        return facetGroups.map(facetGroup => this.cartesianProduct(facetGroup))
            .map(higherOrderFacet => this.filterHigherOrderFacet(higherOrderFacet));
    }

    private cartesianProduct(facets: Facet[]): DisjointCombination[] {
        return facets.reduce<DisjointCombination[]>(
            (accSets, facet) => {
                return accSets.flatMap(accSet => facet.map(value => [...accSet, value]));
            },
            [[]]
        );
    }

    private filterHigherOrderFacet(higherOrderFacet: HigherOrderFacet): HigherOrderFacet {
        if (!this.containsOnlyDigits(higherOrderFacet[0])) {
            return higherOrderFacet;
        }

        const uniqueValuesPerDigitPos: Set<FacetValue>[] = new Array(higherOrderFacet[0].length).fill(0)
            .map(() => new Set());
        const pointerToTheNextPerDigitPos: number[] = new Array(higherOrderFacet[0].length).fill(0);
        const flags: Boolean[][] = [];
        return higherOrderFacet.map(facet => facet.reverse())
            .filter(facet => {
                const numberStr = [...facet].reverse().join('');
                const number = Number(numberStr);

                // Black list rule
                const isBlackListed = this.blackRules.some(rule => {
                    const [min, max] = rule.range;
                    return rule.type === RangeMatchingType.EXACT && min <= number && number <= max;
                });
                if (isBlackListed) {
                    flags.push([]);
                    return false;
                }

                // White list rule
                const isWhiteListed = this.whiteRules.some(rule => {
                    const [min, max] = rule.range;
                    const maxLength = String(max).length;
                    const numberSubstr = numberStr.substr(-maxLength);
                    const subNumber = Number(numberSubstr);
                    return rule.type === RangeMatchingType.INCLUDE && min <= subNumber && subNumber <= max;
                });
                if (isWhiteListed) {
                    flags.push([]);
                    return true;
                }

                // Unique digits rule
                const uniqueFlags = facet.map((value, pos) => {
                    const uniqueValuesAtPosition = uniqueValuesPerDigitPos[pos];
                    const isUnique = !uniqueValuesAtPosition.has(value);
                    if (isUnique) {
                        uniqueValuesAtPosition.add(value);
                    }
                    return isUnique;
                });
                const hasUnique = uniqueFlags.some(isUnique => isUnique);
                if (hasUnique) {
                    flags.push(uniqueFlags);
                }
                return hasUnique;
            })
            .map((facet, index) => {
                const uniqueFlags = flags[index];
                if (!uniqueFlags.length) {
                    return facet;
                }

                // Build with next position before unique
                const firstUniquePosition = uniqueFlags.findIndex(isUnique => isUnique);
                return facet.map((value, pos) => {
                    if (firstUniquePosition <= pos) {
                        return value;
                    }

                    const uniqueValuesAtPosition = uniqueValuesPerDigitPos[pos];
                    const valuesAtPosition = Array.from(uniqueValuesAtPosition);
                    let pointerToTheNext = pointerToTheNextPerDigitPos[pos];
                    const nextValue = valuesAtPosition[pointerToTheNext];
                    pointerToTheNext++;
                    pointerToTheNextPerDigitPos[pos] = pointerToTheNext % valuesAtPosition.length;
                    return nextValue;
                });
            })
            .map(facet => facet.reverse());
    }

    private makeMix(facets: HigherOrderFacet[]): DisjointCombination[] {
        const maxLength = this.getMaxLength(facets);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            result.push(facets.map(facet => facet[i % facet.length]).flat());
        }

        return result;
    }

    private getMaxLength(facets: HigherOrderFacet[]): Max {
        return facets.reduce(
            (max, facet) => Math.max(max, facet.length),
            0
        );
    }
}

type Max = number;
type HigherOrderFacet = Facet[];

enum RangeMatchingType {
    EXACT = 'exact',
    INCLUDE = 'include'
}

interface RangeRule {
    range: [number, number];
    type: RangeMatchingType;
}