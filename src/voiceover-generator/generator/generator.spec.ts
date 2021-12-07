import { Generator } from './generator';
import { Voiceover } from '../entities/voiceover';
import { CarNumber } from '../../common/entities/car-number';
import { RealFacet } from '../facets-generator/real-facet';
import { FacetConfig } from '../pattern-parser/facet-config';

describe('Generator', () => {
    let generator: Generator;

    const defaultOptions = { countPerNumber: 3 };

    beforeEach(() => {
        generator = new Generator();
    });

    describe('#generate', () => {

        it('should generate requested number of voiceovers per car number', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, value: 'М01', keySets: [['М', '0', '1']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] }
            ] as Voiceover[]);
        });

        it('should not generate the same voiceovers even if the count is less than required', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['Н02', [{ config, value: 'Н02', keySets: [['Н', '0', '2']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['н'],
                '0': ['нуль', 'ноль'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'Н02', options: ['н нуль два'] },
                { name: 'Н02', options: ['н ноль два'] }
            ] as Voiceover[]);
        });

        // FIXME: Implement me
        it.skip('should iterate unique combinations even if reached the limit of independent iteration', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['Н02', [{ config, value: 'Н02', keySets: [['Н', '0', '2']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['н'],
                '0': ['нуль', 'ноль'],
                '2': ['два', 'двойка']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'Н02', options: ['н нуль два'] },
                { name: 'Н02', options: ['н ноль двойка'] },
                { name: 'Н02', options: ['н ноль два'] }
            ] as Voiceover[]);
        });

        it('should not generate different voiceovers for the same letter or digit for the same combination', () => {
            const config: FacetConfig = { id: 'N', length: 5 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['00078', [{ config, value: '00078', keySets: [['0', '0', '0', '78']] }]]
            ]);
            const dictionary = {
                '0': ['нуль', 'ноль', 'зеро'],
                '78': ['семьдесят восемь']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: '00078', options: ['нуль нуль нуль семьдесят восемь'] },
                { name: '00078', options: ['ноль ноль ноль семьдесят восемь'] },
                { name: '00078', options: ['зеро зеро зеро семьдесят восемь'] }
            ] as Voiceover[]);
        });

        it('should use distinct value of the same key if the quick mode is enabled', () => {
            const config: FacetConfig = { id: 'N', length: 5 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['00078', [{ config, value: '00078', keySets: [['0', '0', '0', '78']] }]]
            ]);
            const dictionary = {
                '0': ['нуль', 'ноль', 'зеро'],
                '78': ['семьдесят восемь']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, { countPerNumber: 3, isQuirkMode: true });

            expect(voiceovers).toEqual([
                { name: '00078', options: ['ноль нуль зеро семьдесят восемь'] },
                { name: '00078', options: ['нуль зеро ноль семьдесят восемь'] },
                { name: '00078', options: ['нуль нуль нуль семьдесят восемь'] }
            ] as Voiceover[]);
        });

        it('should generate requested number of voiceovers for a key ' +
            'even if there are multiple key sets for a key', () => {
            const keySets = [['М', '00'], ['М', '0', '0']];
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М00', [{ config, value: 'М00', keySets }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '00': ['два ноля', 'дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'М00', options: ['м два ноля'] },
                { name: 'М00', options: ['мы дубль ноль'] },
                { name: 'М00', options: ['мэ дуплет нулей'] }
            ] as Voiceover[]);
        });

        it.skip('should generate more than the representative count if the requested number is greater', () => {
            const keySets = [
                ['М', '0', '1']
            ];
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, value: 'М01', keySets }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, { countPerNumber: 8 });

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

        it('should not continue iterating combinations for another facet value', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, value: 'М01', keySets: [['М', '0', '1']] }]],
                ['Н2М', [{ config, value: 'Н2М', keySets: [['Н', '2', 'М']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина', 'Маша'],
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н2М', options: ['эн два м'] },
                { name: 'Н2М', options: ['нэ два мы'] },
                { name: 'Н2М', options: ['эн два мэ'] }
            ] as Voiceover[]);
        });

        it('should continue iterating combinations for the same facet value', () => {
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configDelimeter: FacetConfig = { id: 'D', length: 1 };
            const configRegion: FacetConfig = { id: 'D', length: 2 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                [
                    'М01 78',
                    [
                        { config: configNumber, value: 'М01', keySets: [['М', '0', '1']] },
                        { config: configDelimeter, value: ' ', keySets: [] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configRegion, value: '78', keySets: [['78'], ['7', '8']] }
                    ]
                ],
                [
                    'Н2М 78',
                    [
                        { config: configNumber, value: 'Н2М', keySets: [['Н', '2', 'М']] },
                        { config: configDelimeter, value: ' ', keySets: [] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configRegion, value: '78', keySets: [['78'], ['7', '8']] }
                    ]
                ]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина', 'Маша'],
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два'],
                '7': ['семерка', 'семь'],
                '8': ['восьмерка', 'восемь'],
                '78': ['семьдесят восемь', 'семьдесят и восемь']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'М01 78', options: ['м нуль один семьдесят восемь'] },
                { name: 'М01 78', options: ['мы ноль один семьдесят и восемь'] },
                { name: 'М01 78', options: ['мэ нуль один семерка восьмерка'] },
                { name: 'Н2М 78', options: ['эн два м семь восемь'] },
                { name: 'Н2М 78', options: ['нэ два мы семьдесят восемь'] },
                { name: 'Н2М 78', options: ['эн два мэ семьдесят и восемь'] }
            ] as Voiceover[]);
        });

        it.skip('should not reset iterating combinations even if reached the limit of dictionary', () => {
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['М01', [{ config, value: 'М01', keySets: [['М', '0', '1']] }]],
                ['Н02', [{ config, value: 'Н02', keySets: [['Н', '0', '2']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                'Н': ['н'],
                '2': ['два']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

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
                // eslint-disable-next-line eigenspace-script/object-properties-carrying
                ['Н00', [{ config, value: 'Н00', keySets: [['Н', '00'], ['Н', '0', '0']] }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль', 'зеро'],
                '00': ['два ноля', 'дуплет нулей']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'Н00', options: ['эн два ноля'] },
                { name: 'Н00', options: ['нэ дуплет нулей'] },
                { name: 'Н00', options: ['эн нуль нуль'] }
            ] as Voiceover[]);
        });

        it('should get less complicated combinations regardless it\'s neighbour is reset', () => {
            const keySets = [['00', '3'], ['0', '0', '3']];
            const config: FacetConfig = { id: 'N', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                ['003', [{ config, value: '003', keySets }]]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                '3': ['три', 'тройка'],
                '0': ['нуль', 'ноль'],
                '00': ['дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: '003', options: ['дубль ноль три'] },
                { name: '003', options: ['дуплет нулей тройка'] },
                { name: '003', options: ['нуль нуль три'] }
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
                        { config: configPrefix, value: 'А', keySets: [['А']] },
                        { config: configNumber, value: '002', keySets: keySetsNumber },
                        { config: configSeries, value: 'ВВ', keySets: keySetsSeries },
                        { config: configEmpty, value: ' ', keySets: [[' ']] },
                        { config: configRegion, value: '78', keySets: keySetsRegion }
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

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'А002ВВ 78', options: ['а два нуля два два вэ регион семьдесят восемь'] },
                { name: 'А002ВВ 78', options: ['Александр два ноля двойка две вэ пробел семь восемь'] },
                { name: 'А002ВВ 78', options: ['Анна дубль нуль два дубль вэ регион семерка восьмерка'] }
            ] as Voiceover[]);
        });

        it('should skip empty key sets', () => {
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configEmpty: FacetConfig = { id: 'E', length: 1 };
            const configRegion: FacetConfig = { id: 'R', length: 2 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                [
                    'A021 MH',
                    [
                        { config: configPrefix, value: 'A', keySets: [] },
                        { config: configNumber, value: '021', keySets: [['0', '1']] },
                        { config: configEmpty, value: ' ', keySets: [] },
                        { config: configRegion, value: 'MH', keySets: [['M']] }
                    ]
                ]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                '0': ['ноль', 'нуль'],
                '1': ['один', 'однёрка'],
                'M': ['эм']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'A021 MH', options: ['ноль один эм'] },
                { name: 'A021 MH', options: ['нуль однёрка эм'] }
            ] as Voiceover[]);
        });

        it('should continue iterate through the key sets of a facet ' +
            'which all the dictionary keys are already eaten for', () => {
            const configPrefix: FacetConfig = { id: 'L', length: 1 };
            const configNumber: FacetConfig = { id: 'N', length: 3 };
            const configEmpty: FacetConfig = { id: 'E', length: 1 };
            const configRegion: FacetConfig = { id: 'R', length: 3 };
            const facetsMap = new Map<CarNumber, RealFacet[]>([
                [
                    'Т012 177',
                    [
                        { config: configPrefix, value: 'Т', keySets: [['Т']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configNumber, value: '012', keySets: [['0', '12'], ['0', '1', '2']] },
                        { config: configEmpty, value: ' ', keySets: [[' ']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        {
                            config: configRegion,
                            value: '177',
                            keySets: [['177'], ['17', '7'], ['1', '77'], ['1', '7', '7']]
                        }
                    ]
                ],
                [
                    'Н001 47',
                    [
                        { config: configPrefix, value: 'Н', keySets: [['Н']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configNumber, value: '001', keySets: [['00', '1'], ['0', '0', '1']] },
                        { config: configEmpty, value: ' ', keySets: [[' ']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configRegion, value: '47', keySets: [['47'], ['4', '7']] }
                    ]
                ],
                [
                    'В088 47',
                    [
                        { config: configPrefix, value: 'В', keySets: [['В']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configNumber, value: '088', keySets: [['0', '88'], ['0', '8', '8']] },
                        { config: configEmpty, value: ' ', keySets: [[' ']] },
                        // eslint-disable-next-line eigenspace-script/object-properties-carrying
                        { config: configRegion, value: '47', keySets: [['47'], ['4', '7']] }
                    ]
                ]
            ]);
            // noinspection NonAsciiCharacters
            const dictionary = {
                'В': ['вэ', 'в', 'Владимир', 'Вера', 'Василий'],
                'Н': ['эн', 'нэ', 'н', 'Николай', 'Наталья', 'Никита'],
                'Т': ['тэ', 'т', 'Тимур', 'Татьяна', 'Тарас'],
                '0': ['ноль', 'нуль'],
                '00': ['два нуля', 'два ноля', 'дубль нуль', 'дубль ноль', 'дуплет нулей', 'дуплет нолей'],
                '1': ['один', 'единица'],
                '2': ['два', 'двойка'],
                '4': ['четыре', 'четверка'],
                '7': ['семь', 'семерка'],
                '8': ['восемь', 'восьмерка'],
                '12': ['двенадцать'],
                '17': ['семнадцать'],
                '47': ['сорок семь'],
                '77': ['семьдесят семь', 'две семерки', 'дубль семь', 'дуплет семерок'],
                '88': ['восемьдесят восемь', 'две восьмерки', 'дубль восемь', 'дуплет восьмерок'],
                '177': ['сто семьдесят семь'],
                ' ': ['регион']
            };

            const voiceovers = generator.generate(facetsMap, dictionary, defaultOptions);

            expect(voiceovers).toEqual([
                { name: 'Т012 177', options: ['тэ ноль двенадцать регион сто семьдесят семь'] },
                { name: 'Т012 177', options: ['т нуль двенадцать регион семнадцать семь'] },
                { name: 'Т012 177', options: ['Тимур ноль один два регион семнадцать семерка'] },
                { name: 'Н001 47', options: ['эн два нуля один регион сорок семь'] },
                { name: 'Н001 47', options: ['нэ два ноля единица регион четыре семь'] },
                { name: 'Н001 47', options: ['н дубль нуль один регион четверка семерка'] },
                { name: 'В088 47', options: ['вэ ноль восемьдесят восемь регион сорок семь'] },
                { name: 'В088 47', options: ['в нуль две восьмерки регион четыре семь'] },
                { name: 'В088 47', options: ['Владимир ноль дубль восемь регион четверка семерка'] }
            ] as Voiceover[]);
        });
    });
});