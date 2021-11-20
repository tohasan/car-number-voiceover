import { Facet, HigherOrderFacet } from '../../entities/facet';
import { Max } from '../../entities/numeric';

/**
 * It would be better to create class Facet
 * with methods instead of creating utils
 * Remember that a static class is a red light.
 */
export class FacetUtils {

    static getMaxLength(facets: HigherOrderFacet[]): Max {
        return facets.reduce(
            (max, facet) => Math.max(max, facet.length),
            0
        );
    }

    static containsOnlyLetters(facet: Facet): boolean {
        return facet.every(value => /[a-zа-я]/i.test(value));
    }

    static containsOnlyDigits(facet: Facet): boolean {
        return facet.every(value => /[0-9]/.test(value));
    }
}