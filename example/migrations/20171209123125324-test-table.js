export const up = async (r, connection) => {
    await r.tableCreate('test').run();
};

export const down = async (r, connection) => {
    await r.tableDrop('test').run();
};
