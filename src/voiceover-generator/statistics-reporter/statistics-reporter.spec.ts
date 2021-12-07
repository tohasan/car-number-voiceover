import { StatisticsReporter } from './statistics-reporter';
import { dependencies } from '../../common/utils/specs/dependencies';
import { Voiceover } from '../entities/voiceover';
import { FacetConfig } from '../pattern-parser/facet-config';
import { CarNumber } from '../../common/entities/car-number';
import { RealFacet } from '../facets-generator/real-facet';

describe('StatisticsReporter', () => {
    let statisticsReporter: StatisticsReporter;

    const { output } = dependencies;

    beforeEach(() => {
        statisticsReporter = new StatisticsReporter();
    });

    describe('#report', () => {
        // noinspection NonAsciiCharacters
        const dictionary = {
            'А': ['а'],
            'М': ['мэ', 'эм', 'Мария'],
            'Н': ['нэ', 'эн'],
            '1': ['один'],
            '00': ['два нуля']
        };
        const config: FacetConfig = { id: 'N', length: 5 };
        const facetsMap = new Map<CarNumber, RealFacet[]>([
            ['М001Н', [{ config, keySets: [['М', '00', '1', 'Н']] }]],
            ['Н100М', [{ config, keySets: [['Н', '1', '00', 'М']] }]]
        ]);

        it('should report about used keys', () => {
            const voiceovers: Voiceover[] = [
                { name: 'М001Н', options: ['мэ два нуля один эн'] },
                { name: 'Н100М', options: ['нэ один два нуля эм'] }
            ];

            statisticsReporter.report(voiceovers, facetsMap, dictionary);

            expect(output.getLogs()).toContain([
                'Used keys:',
                'М, 00, 1, Н'
            ].join('\n'));
        });

        it('should report that all used keys are fully utilized', () => {
            const voiceovers: Voiceover[] = [
                { name: 'М001Н', options: ['мэ два нуля один нэ'] },
                { name: 'М001Н', options: ['эм два нуля один эн'] },
                { name: 'Н100М', options: ['нэ один два нуля Мария'] }
            ];

            statisticsReporter.report(voiceovers, facetsMap, dictionary);

            expect(output.getLogs()).toContain('All keys are fully utilized.');
        });

        it('should report about utilization of keys that are not fully utilized', () => {
            const voiceovers: Voiceover[] = [
                { name: 'М001Н', options: ['мэ два нуля один эн'] },
                { name: 'Н100М', options: ['нэ один два нуля эм'] }
            ];

            statisticsReporter.report(voiceovers, facetsMap, dictionary);

            expect(output.getLogs()).toContain([
                'Keys utilization:',
                '  М: 66%',
                'Other keys are fully utilized.'
            ].join('\n'));
        });
    });
});