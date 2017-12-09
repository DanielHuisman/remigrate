const COUNT = 10;

export const up = async (r, connection, run) => {
    await run(r.table('test').insert([...Array(COUNT)].map((_, index) => ({
        id: index,
        number: Math.floor(Math.random() * 1000)
    }))), false);
};

export const down = async (r, connection, run) => {
    await run(r.table('test').between(0, COUNT).delete(), false);
};
