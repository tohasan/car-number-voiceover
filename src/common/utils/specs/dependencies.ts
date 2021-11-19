import Mock = jest.Mock;

function getLogs(): string {
    // eslint-disable-next-line no-console
    return (console.log as Mock).mock.calls.flat().join('\n');
}

export const dependencies = {
    output: { getLogs }
};