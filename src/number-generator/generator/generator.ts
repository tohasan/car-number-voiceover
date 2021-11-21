import { CarNumber } from '../../common/entities/car-number';
import { Facet, FacetValue, HigherOrderFacet } from '../../common/entities/facet';
import { Logger } from '../../common/utils/logger/logger';
import { Combinator } from '../../common/combinator/combinator';
import { FacetUtils } from '../../common/utils/facet-utils/facet.utils';

export class Generator {
    private logger = new Logger();
    private combinator = new Combinator();

    private whiteRules: RangeRule[] = [
        { range: [10, 19], type: RangeMatchingType.INCLUDE }
    ];
    private blackRules: RangeRule[] = [
        { range: [0, 0], type: RangeMatchingType.EXACT }
    ];

    generate(facets: Facet[], requestedCount?: number): CarNumber[] {
        const facetGroups = this.groupSimilarFacets(facets);
        const higherOrderFacets = this.generateHigherOrderFacets(facetGroups);
        const maxCount = this.combinator.calculateCombinationsLimit(higherOrderFacets);
        const representativeCount = this.combinator.calculateRepresentativeCount(higherOrderFacets);

        this.provideInfoAboutRequestedCount(maxCount, representativeCount, requestedCount);
        this.logger.log('Generating numbers...');
        const resultSet = this.combinator.generateRequestedCount(higherOrderFacets, requestedCount);

        this.logger.log(`Number of generated car numbers: ${resultSet.length}`);
        return resultSet.map(combination => combination.join(''));
    }

    // noinspection JSMethodCanBeStatic
    private groupSimilarFacets(facets: Facet[]): Facet[][] {
        const groups: Facet[][] = [];
        let group: Facet[] = [];
        for (const facet of facets) {
            if (!group.length) {
                group.push(facet);
                continue;
            }

            const isOnlyLetters = FacetUtils.containsOnlyLetters(facet) && FacetUtils.containsOnlyLetters(group[0]);
            if (isOnlyLetters) {
                group.push(facet);
                continue;
            }

            const isOnlyDigits = FacetUtils.containsOnlyDigits(facet) && FacetUtils.containsOnlyDigits(group[0]);
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

    private generateHigherOrderFacets(facetGroups: Facet[][]): HigherOrderFacet[] {
        return this.combinator.generateHigherOrderFacets(facetGroups)
            .map(higherOrderFacet => this.filterHigherOrderFacet(higherOrderFacet));
    }

    private filterHigherOrderFacet(higherOrderFacet: HigherOrderFacet): HigherOrderFacet {
        if (!FacetUtils.containsOnlyDigits(higherOrderFacet[0])) {
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

    private provideInfoAboutRequestedCount(
        maxCount: number,
        representativeCount: number,
        requestedCount?: number
    ): void {
        this.logger.log(`The representative set of car numbers consists of: ${representativeCount} items`);

        if (!requestedCount) {
            this.logger.log(
                'You did not request a special set size. ' +
                'You can use the parameter `--count`. By default the representative count will be generated.'
            );
            return;
        }

        this.logger.log(`The requested count: ${requestedCount}`);
        if (maxCount < requestedCount) {
            this.logger.log('Pay attention! It exceeds the maximum count the generator can produce.');
        } else if (representativeCount < requestedCount) {
            this.logger.log(
                'It exceeds the representative count. ' +
                'That\'s okay. The only thing is that you can generate a bit less.'
            );
        } else if (representativeCount === requestedCount) {
            this.logger.log('Bullseye! You know how to choose numbers!');
        } else {
            this.logger.log('Pay attention! You are going to generate a set less than the representative one.');
        }
    }
}

enum RangeMatchingType {
    EXACT = 'exact',
    INCLUDE = 'include'
}

interface RangeRule {
    range: [number, number];
    type: RangeMatchingType;
}