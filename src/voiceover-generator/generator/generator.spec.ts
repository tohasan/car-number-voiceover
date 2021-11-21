import { Generator } from './generator';
import { Voiceover } from '../entities/voiceover';

describe('Generator', () => {
    let generator: Generator;

    beforeEach(() => {
        generator = new Generator();
    });

    describe('#generate', () => {

        it('should generate representative set', () => {
            const keySets = [
                ['0', '7', '8']
            ];
            const dictionary = {
                '0': ['нуль', 'ноль'],
                '7': ['семь', 'семёрка'],
                '8': ['восемь', 'восьмёрка']
            };

            const voiceovers = generator.generate(keySets, dictionary);

            expect(voiceovers).toEqual([
                { name: '078', options: ['нуль семь восемь'] },
                { name: '078', options: ['ноль семёрка восьмёрка'] }
            ] as Voiceover[]);
        });

        it('should not generate different voiceovers for the same letter or digit for the same combination', () => {
            const keySets = [
                ['0', '0', '0', '78']
            ];
            const dictionary = {
                '0': ['нуль', 'ноль'],
                '78': ['семьдесят восемь']
            };

            const voiceovers = generator.generate(keySets, dictionary);

            expect(voiceovers).toEqual([
                { name: '00078', options: ['нуль нуль нуль семьдесят восемь'] },
                { name: '00078', options: ['ноль ноль ноль семьдесят восемь'] }
            ] as Voiceover[]);
        });

        it('should generate representative sets of voiceovers per different keys', () => {
            const keySets = [
                ['М', '0', '1'],
                ['Н', '0', '2']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                'Н': ['н'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(keySets, dictionary);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'М01', options: ['эм ноль один'] },
                { name: 'М01', options: ['Марина нуль один'] },
                { name: 'Н02', options: ['н нуль два'] },
                { name: 'Н02', options: ['н ноль два'] }
            ] as Voiceover[]);
        });

        it('should generate requested number of voiceovers for a key ' +
            'even if the representative count is greater', () => {
            const keySets = [
                ['М', '0', '1']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] }
            ] as Voiceover[]);
        });

        it('should generate requested number of voiceovers for a key ' +
            'even if there are multiple key sets for a key', () => {
            const keySets = [
                ['М', '0', '0'],
                ['М', '00']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '00': ['два ноля', 'дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М00', options: ['м нуль нуль'] },
                { name: 'М00', options: ['мы ноль ноль'] },
                { name: 'М00', options: ['мэ нуль нуль'] }
            ] as Voiceover[]);
        });

        it('should generate more than the representative count if the requested number is greater', () => {
            const keySets = [
                ['М', '0', '1']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(keySets, dictionary, 8);

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
            const keySets = [
                ['М', '0', '1'],
                ['Н', '2', 'М']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина', 'Маша'],
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н2М', options: ['эн два эм'] },
                { name: 'Н2М', options: ['нэ два Марина'] },
                { name: 'Н2М', options: ['эн два Маша'] }
            ] as Voiceover[]);
        });

        it('should reset iterating combinations if reached the limit of dictionary', () => {
            const keySets = [
                ['М', '0', '1'],
                ['Н', '0', '2']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                'Н': ['эн', 'нэ'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н02', options: ['эн нуль два'] },
                { name: 'Н02', options: ['нэ ноль два'] }
            ] as Voiceover[]);
        });

        it('should get more complicated combinations if the rest of the dictionary does not contains simple', () => {
            const keySets = [
                ['Н', '0', '2'],
                ['М', '0', '0'],
                ['М', '00']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'Н': ['эн', 'нэ'],
                '2': ['два'],
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '00': ['два ноля', 'дубль ноль', 'дуплет нулей']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'Н02', options: ['эн нуль два'] },
                { name: 'Н02', options: ['нэ ноль два'] },
                { name: 'Н02', options: ['нэ нуль два'] },
                { name: 'М00', options: ['м два ноля'] },
                { name: 'М00', options: ['мы дубль ноль'] },
                { name: 'М00', options: ['мэ дуплет нулей'] }
            ] as Voiceover[]);
        });

        it('should not generate more than representative count ' +
            'even if the requested number is greater', () => {
            const keySets = [
                ['М', '0', '1']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                '0': ['нуль', 'ноль'],
                '1': ['один']
            };

            const voiceovers = generator.generate(keySets, dictionary, 8);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'М01', options: ['эм ноль один'] },
                { name: 'М01', options: ['Марина нуль один'] }
            ] as Voiceover[]);
        });

        it('should not generate more than maximum when processing multiple keys', () => {
            const keySets = [
                ['М', '0', '1'],
                ['Н', '0', '2']
            ];
            // noinspection NonAsciiCharacters
            const dictionary = {
                'М': ['м', 'мы', 'мэ', 'эм', 'Марина'],
                'Н': ['н'],
                '0': ['нуль', 'ноль'],
                '1': ['один'],
                '2': ['два']
            };

            const voiceovers = generator.generate(keySets, dictionary, 3);

            expect(voiceovers).toEqual([
                { name: 'М01', options: ['м нуль один'] },
                { name: 'М01', options: ['мы ноль один'] },
                { name: 'М01', options: ['мэ нуль один'] },
                { name: 'Н02', options: ['н ноль два'] },
                { name: 'Н02', options: ['н нуль два'] }
            ] as Voiceover[]);
        });
    });
});