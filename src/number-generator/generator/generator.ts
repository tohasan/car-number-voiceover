import { CarNumber } from '../../common/entities/car-number';
import { Facet, FacetValue } from '../../common/entities/facet';
import { DisjointCombination } from '../../common/entities/disjoint-combination';

export class Generator {
    private whiteRules: RangeRule[] = [
        { range: [10, 19], type: RangeMatchingType.INCLUDE }
    ];
    private blackRules: RangeRule[] = [
        { range: [0, 0], type: RangeMatchingType.EXACT }
    ];

    generate(facets: Facet[]): CarNumber[] {
        const facetGroups = this.groupSimilarFacets(facets);
        const higherOrderFacets = this.generateHigherOrderFacets(facetGroups);
        return this.makeMix(higherOrderFacets)
            .map(set => set.join(''));
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
        const uniqueWhiteListedValues = new Set<number>();
        const uniqueSimilarSequences = new Set<string>();
        const pointerToTheNextPerDigitPos: number[] = new Array(higherOrderFacet[0].length).fill(0);
        return higherOrderFacet.map(facet => facet.reverse())
            .map(facet => {
                if (this.isBlackListed(facet)) {
                    return [];
                }

                let resultFacet = facet;
                const [hasUnique, uniqueFlags] = this.hasUniqueDigits(facet, uniqueValuesPerDigitPos);
                if (hasUnique) {
                    resultFacet = this.transformFacetWithTheNextValuesBeforeUniquePosition(
                        facet,
                        uniqueFlags,
                        uniqueValuesPerDigitPos,
                        pointerToTheNextPerDigitPos
                    );
                }

                const isWhiteListed = this.isWhiteListed(facet, uniqueWhiteListedValues);
                const hasUniqueSimilarSequence = this.hasUniqueSimilarSequence(resultFacet, uniqueSimilarSequences);
                const shouldPresent = isWhiteListed || hasUnique || hasUniqueSimilarSequence;

                return shouldPresent ? resultFacet : [];
            })
            .filter(facet => Boolean(facet.length))
            .map(facet => facet.reverse());
    }

    private isBlackListed(facet: Facet): boolean {
        const numberStr = [...facet].reverse().join('');
        const number = Number(numberStr);

        return this.blackRules.some(rule => {
            const [min, max] = rule.range;
            return rule.type === RangeMatchingType.EXACT && min <= number && number <= max;
        });
    }

    private isWhiteListed(facet: Facet, uniqueWhiteListedValues: Set<number>): boolean {
        const numberStr = [...facet].reverse().join('');

        return this.whiteRules.some(rule => {
            const [min, max] = rule.range;
            const maxLength = String(max).length;
            const numberSubstr = numberStr.substr(-maxLength);
            const subNumber = Number(numberSubstr);
            const isWhite = rule.type === RangeMatchingType.INCLUDE
                && min <= subNumber && subNumber <= max
                && !uniqueWhiteListedValues.has(subNumber);

            if (isWhite) {
                uniqueWhiteListedValues.add(subNumber);
            }

            return isWhite;
        });
    }

    private hasUniqueDigits(facet: Facet, uniqueValuesPerDigitPos: Set<FacetValue>[]): [boolean, boolean[]] {
        const uniqueFlags = facet.map((value, pos) => {
            const uniqueValuesAtPosition = uniqueValuesPerDigitPos[pos];
            const isUnique = !uniqueValuesAtPosition.has(value);
            if (isUnique) {
                uniqueValuesAtPosition.add(value);
            }
            return isUnique;
        });

        const hasUnique = uniqueFlags.some(isUnique => isUnique);
        return [hasUnique, uniqueFlags];
    }

    // noinspection JSMethodCanBeStatic
    private hasUniqueSimilarSequence(facet: Facet, uniqueSimilarSequences: Set<string>): boolean {
        const numberStr = [...facet].reverse().join('');
        let sequence = '';
        let hasUniqueSimilarSequence = false;

        for (let i = 0; i < numberStr.length; i++) {
            const isLastDigit = numberStr.length - 1 === i;
            const digit = numberStr[i];
            if (!sequence.length) {
                sequence += digit;
                continue;
            }

            // eslint-disable-next-line eigenspace-script/conditions
            if (sequence[sequence.length - 1] === digit) {
                sequence += digit;
                if (!isLastDigit) {
                    continue;
                }
            }

            if (1 < sequence.length && !uniqueSimilarSequences.has(sequence)) {
                uniqueSimilarSequences.add(sequence);
                hasUniqueSimilarSequence = true;
                break;
            }

            sequence = digit;
        }

        return hasUniqueSimilarSequence;
    }

    private transformFacetWithTheNextValuesBeforeUniquePosition(
        facet: Facet,
        uniqueFlags: boolean[],
        uniqueValuesPerDigitPos: Set<FacetValue>[],
        pointerToTheNextPerDigitPos: number[]
    ): Facet {
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
            // eslint-disable-next-line no-param-reassign
            pointerToTheNextPerDigitPos[pos] = pointerToTheNext % valuesAtPosition.length;
            return nextValue;
        });
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