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

## Example
See the `example` folder for a basic example.
