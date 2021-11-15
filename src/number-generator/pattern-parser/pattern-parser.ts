import { Facet, FacetValue } from '../../common/entities/facet';
import { Definition } from '../entities/definition';
import { AppError } from '../../common/entities/errors/app-error';

export class PatternParser {
    private readonly FACET_PATTERN = /[\[\]]/g;
    private readonly FACET_SEPARATOR_PATTERN = /\s*,\s*/;
    private readonly FACET_RANGE_SEPARATOR_PATTERN = '-';

    parse(pattern: string, definitionStrings: string[]): Facet[] {
        const positions = this.parseFacet(pattern);
        const definitions = definitionStrings.map(defStr => this.parseDefinition(defStr));
        const definitionMap = new Map<string, Facet>(definitions.map(def => [def.name, def.facet]));

        return positions.map(pos => {
            if (definitionMap.has(pos)) {
                return definitionMap.get(pos)!;
            }

            throw new AppError(`Can not find a definition for: '${pos}'`);
        });
    }

    private parseDefinition(definitionString: string): Definition {
        const [name, facetStr] = definitionString.split('=');
        const facetRanges = this.parseFacet(facetStr);
        const facet = facetRanges.map(facetRange => this.parseFacetRange(facetRange))
            .flat();
        return { name, facet };
    }

    private parseFacet(facetStr: string): FacetValue[] {
        return facetStr.replace(this.FACET_PATTERN, '')
            .split(this.FACET_SEPARATOR_PATTERN);
    }

    private parseFacetRange(facetRangeStr: string): FacetValue[] {
        const [startChar, endChar] = facetRangeStr.split(this.FACET_RANGE_SEPARATOR_PATTERN);

        if (!endChar) {
            return [startChar];
        }

        const facetValues = [];
        for (let c = startChar.charCodeAt(0); c <= endChar.charCodeAt(0); c++) {
            facetValues.push(String.fromCharCode(c));
        }
        return facetValues;
    }
}