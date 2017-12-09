import fs from 'fs';
import util from 'util';
import mkdirp from 'mkdirp';

export const access = util.promisify(fs.access);
export const read = util.promisify(fs.readFile);
export const write = util.promisify(fs.writeFile);
export const readdir = util.promisify(fs.readdir);

export const exists = async (file, permission = '') => {
    try {
        const flags = permission.split('').reduce((final, c) => {
            switch (c) {
                case 'r':
                    return final | fs.constants.R_OK;
                case 'w':
                    return final | fs.constants.W_OK;
                case 'x':
                    return final | fs.constants.X_OK;
            }
        }, fs.constants.F_OK);

        await access(file, flags);
        return true;
    } catch (err) {
        return false;
    }
};

export const mkdirs = util.promisify(mkdirp);
