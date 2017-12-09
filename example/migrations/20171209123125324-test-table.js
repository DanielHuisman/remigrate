export const up = async (r, connection, run) => {
    await run(r.tableCreate('test'), false);
};

export const down = async (r, connection, run) => {
    await run(r.tableDrop('test'), false);
};
