import { Logger } from './logger';
import { dependencies } from '../specs/dependencies';

describe('Logger', () => {
    let logger: Logger;
    const { output } = dependencies;

    beforeEach(() => {
        logger = new Logger();
    });

    describe('#log', () => {

        it('should output a specified message', () => {
            logger.log('message');
            expect(output.getLastLog()).toEqual('message');
        });
    });
});