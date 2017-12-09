const COUNT = 10;

export const up = async (r, connection) => {
    await r.table('test').insert([...Array(COUNT)].map((_, index) => ({
        id: index,
        number: Math.floor(Math.random() * 1000)
    })));
};

export const down = async (r, connection) => {
    await r.table('test').between(0, COUNT).delete();
};
