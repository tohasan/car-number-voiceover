import { Generator } from './generator';
import { Voiceover } from '../entities/voiceover';
import { CarNumber } from '../../common/entities/car-number';
import { RealFacet } from '../facets-generator/real-facet';
import { FacetConfig } from '../pattern-parser/facet-config';

describe('Generator', () => {
    let generator: Generator;

    beforeEach(() => {
        generator = new Generator();
    });

    describe('#generate', () => {

        it('should generate requested number of voiceovers per car number', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, keySets: [['М', '0', '1']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] }
            ] as Voiceover[]);
        });

        it('should not generate the same voiceovers even if the count is less than required', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['Н02', [{ config, keySets: [['Н', '0', '2']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['н'],
                '0': ['нуль', 'ноль'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'Н02', options: ['н нуль два'] },
                { name: 'Н02', options: ['н ноль два'] }
            ] as Voiceover[]);
        });

        it('should not generate different voiceovers for the same letter or digit for the same combination', () => {
            const config: FacetConfig = { id: 'N', length: 5 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['00078', [{ config, keySets: [['0', '0', '0', '78']] }]]
            ]);
            const dictionary = {
                '0': ['нуль', 'ноль', 'зеро'],
                '78': ['семьдесят восемь']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: '00078', options: ['нуль нуль нуль семьдесят восемь'] },
                { name: '00078', options: ['ноль ноль ноль семьдесят восемь'] },
                { name: '00078', options: ['зеро зеро зеро семьдесят восемь'] }
            ] as Voiceover[]);
        });

        it('should generate requested number of voiceovers for a key ' +
            'even if there are multiple key sets for a key', () => {
            const keySets = [['М', '00'], ['М', '0', '0']];
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М00', [{ config, keySets }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '00': ['два ноля', 'дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М00', options: ['м два ноля'] },
                { name: 'М00', options: ['мы дубль ноль'] },
                { name: 'М00', options: ['мэ дуплет нулей'] }
            ] as Voiceover[]);
        });

        it('should generate more than the representative count if the requested number is greater', () => {
            const keySets = [
                ['М', '0', '1']
            ];
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, keySets }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 8);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'М01', options: ['эм ноль один'] },
                { name: 'М01', options: ['Марина нуль один'] },
                { name: 'М01', options: ['м ноль один'] },
                { name: 'М01', options: ['мы нуль один'] },
                { name: 'М01', options: ['мэ ноль один'] }
            ] as Voiceover[]);
        });

        it('should continue iterating combinations for the next key', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, keySets: [['М', '0', '1']] }]],
                ['Н2М', [{ config, keySets: [['Н', '2', 'М']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина', 'Маша'],
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н2М', options: ['эн два эм'] },
                { name: 'Н2М', options: ['нэ два Марина'] },
                { name: 'Н2М', options: ['эн два Маша'] }
            ] as Voiceover[]);
        });

        it('should not reset iterating combinations even if reached the limit of dictionary', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, keySets: [['М', '0', '1']] }]],
                ['Н02', [{ config, keySets: [['Н', '0', '2']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                'Н': ['н'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н02', options: ['н ноль два'] },
                { name: 'Н02', options: ['н нуль два'] }
            ] as Voiceover[]);
        });

        it('should get less complicated combinations ' +
            'if the rest of the dictionary does not contain the most long', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['Н00', [{ config, keySets: [['Н', '00']] }]],
                // eslint-disable-next-line eigenspace-script/object-properties-carrying
                ['М00', [{ config, keySets: [['М', '00'], ['М', '0', '0']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['эн', 'нэ'],
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль', 'зеро'],
                '00': ['два ноля', 'дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'Н00', options: ['эн два ноля'] },
                { name: 'Н00', options: ['нэ дубль ноль'] },
                { name: 'Н00', options: ['эн дуплет нулей'] },
                { name: 'М00', options: ['м нуль нуль'] },
                { name: 'М00', options: ['мы ноль ноль'] },
                { name: 'М00', options: ['мэ зеро зеро'] }
            ] as Voiceover[]);
        });

        it('should get combinations that contains more long combinations than others ' +
            'if there are more than one in a car number', () => {
            const configPrefix: FacetConfig = { id: 'P', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const keySetsNumber = [['00', '2'], ['0', '0', '2']];
            const configSeries: FacetConfig = { id: 'S', length: 2 };
            const keySetsSeries = [['ВВ'], ['В', 'В']];
            const configEmpty: FacetConfig = { id: 'E', length: 1 };
            const configRegion: FacetConfig = { id: 'R', length: 2 };
            const keySetsRegion = [['78'], ['7', '8']];
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                [
                    'А002ВВ 78',
                    [
                        { config: configPrefix, keySets: [['А']] },
                        { config: configNumber, keySets: keySetsNumber },
                        { config: configSeries, keySets: keySetsSeries },
                        { config: configEmpty, keySets: [[' ']] },
                        { config: configRegion, keySets: keySetsRegion }
                    ]
                ]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'А': ['а', 'Александр', 'Анна', 'Андрей'],
                'В': ['вэ', 'в', 'Владимир', 'Вера', 'Василий'],
                'ВВ': ['два вэ', 'две вэ', 'дубль вэ', 'дуплет вэ', 'два в', 'две в', 'дубль в', 'дуплет в'],
                '0': ['ноль', 'нуль'],
                '00': ['два нуля', 'два ноля', 'дубль нуль', 'дубль ноль', 'дуплет нулей', 'дуплет нолей'],
                '2': ['два', 'двойка'],
                '7': ['семь', 'семерка'],
                '8': ['восемь', 'восьмерка'],
                '78': ['семьдесят восемь'],
                ' ': ['регион', 'пробел']
            };
            const voiceovers = generator.generate(facetsMap, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'А002ВВ 78', options: ['а два нуля два два вэ регион семьдесят восемь'] },
                { name: 'А002ВВ 78', options: ['Александр два ноля двойка две вэ пробел семь восемь'] },
                { name: 'А002ВВ 78', options: ['Анна дубль нуль два дубль вэ регион семерка восьмерка'] }
            ] as Voiceover[]);
        });
    });
});