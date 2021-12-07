import { FacetConfig, FacetId } from './facet-config';

export class PatternParser {
    private readonly FACET_PATTERN = /[\[\]]/g;
    private readonly FACET_SEPARATOR_PATTERN = /\s*,\s*/;

    parse(pattern: string): FacetConfig[] {
        const facetIds = this.parseFacet(pattern);

        const facetConfigs = new Map<FacetId, FacetConfig>();
        facetIds.forEach(id => {
            const facetConfig = facetConfigs.get(id) || { id, length: 0 };
            facetConfig.length++;
            facetConfigs.set(id, facetConfig);
        });

        return Array.from(facetConfigs.values());
    }

    private parseFacet(facetStr: string): FacetId[] {
        return facetStr.replace(this.FACET_PATTERN, '')
            .split(this.FACET_SEPARATOR_PATTERN);
    }
}