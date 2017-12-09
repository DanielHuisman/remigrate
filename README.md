# remigrate

RethinkDB migrations.

## Installation
```bash
yarn add @danielhuisman/remigrate
```

## Usage
```
remigrate

  RethinkDB migrations.

Synopsis

  remigrate <options> <command>

Commands

  create     Create a new migration
  status     Print the current migration
  up         Run all outstanding up migrations
  down       Run one down migration
  down-all   Run all down migrations

Options

  -c, --config string   Path of the configuration file
  --name string         Name of the migration to create
```

## Configuration
**`package.json`**
```javascript
{
    "name": "my-package",
    "devDependencies": {
        "@danielhuisman/remigrate": "1"
    },
    "scripts": {
        "migrate": "remigrate -c src/config.js"
    }
}

```

**`config.js`**
```javascript
export default {
    // Path to the migrations folder (relative to current working directory)
    migrations: 'src/migrations',

    // Migration template (es5, es6, es6-async)
    template: 'es6-async',

    // RethinkDB driver (rethinkdb, rethinkdbdash)
    driver: 'rethinkdbdash',

    // Driver options
    db: 'example',
    user: 'example',
    password: 'example'
};
```

### ES6
Remigrate supports ES6 through `babel-node`. To enable this, change your `package.json` to:
```javascript
{
    "name": "my-package",
    "scripts": {
        "migrate": "babel-node node_modules/.bin/remigrate -c src/config.js"
    },
    "devDependencies": {
        "@danielhuisman/remigrate": "1",
        "babel-cli": "6",
        "babel-core": "6"
    }
}
```

## Example
See the `example` folder for a basic example.
