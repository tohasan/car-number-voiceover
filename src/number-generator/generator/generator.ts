import { CarNumber } from '../../common/entities/car-number';
import { Facet } from '../../common/entities/facet';
import { Combinator } from '../../common/combinator/combinator';

export class Generator {
    private combinator = new Combinator();

    generate(facets: Facet[]): CarNumber[] {
        return this.combinator.cartesianProduct(facets)
            .map(set => set.join(''));
    }
}