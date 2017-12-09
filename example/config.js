export default {
    migrations: 'migrations',
    template: 'es6-async',

    driver: 'rethinkdbdash',
    db: 'example',
    user: 'example',
    password: 'example',
    servers: [{
        host: 'ssh.danielhuisman.io',
        port: 28015
    }]
};
