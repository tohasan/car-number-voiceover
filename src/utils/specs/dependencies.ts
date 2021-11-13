import Mock = jest.Mock;

function getLastLog(): string[] {
    // eslint-disable-next-line no-console
    return (console.log as Mock).mock.calls.flat().pop();
}

export const dependencies = {
    output: { getLastLog }
};