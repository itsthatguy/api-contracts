#!/usr/bin/env node
import * as yargs from 'yargs';

import { log, textHelpers } from '../lib/log';
import Config from '../lib/config';

import {
  initHandler,
  linkHandler,
  publishHandler,
  versionHandler,
  watchHandler,
  compileHandler,
} from './handlers';

const initOptions: yargs.CommandModule = {
  command: 'init [name]',
  describe: 'Scaffolds basic rivet configuration, files, and directories',
  aliases: ['init'],
  handler: initHandler,
};

const versionOptions: yargs.CommandModule = {
  command: 'version <version|major|minor|patch>',
  aliases: ['version', 'v'],
  describe: 'Bump the package version',
  handler: versionHandler,
};

const publishOptions: yargs.CommandModule = {
  command: 'publish [version|major|minor|patch]',
  aliases: ['publish', 'pub', 'p'],
  describe: 'Publish the package with an optional version bump',
  handler: publishHandler,
};

const linkOptions: yargs.CommandModule = {
  command: 'link [pkg]',
  aliases: ['link', 'l'],
  describe: 'Link the package in the global node_modules',
  handler: linkHandler,
};

const compileOptions: yargs.CommandModule = {
  command: 'compile [src]',
  aliases: ['compile', 'c'],
  describe: 'Compile contracts from the [src] to JSON',
  builder: {
    clean: { default: false },
    src: {
      default: false,
      aliases: ['input', 'inputDir', 'in'],
    },
    cwd: {
      default: Config.contractsRoot,
    },
    ignore: {
      default: false,
      type: 'array'
    },
    out: {
      aliases: ['outputDir', 'output'],
      default: Config.compiledContractsRoot,
    }
  },
  handler: compileHandler,
};

const watchOptions: yargs.CommandModule = {
  command: 'watch',
  aliases: ['w'],
  builder: {
    src: {
      default: Config.contractsPath,
      aliases: ['input', 'inputDir', 'in'],
    },
    cwd: {
      default: Config.contractsRoot,
    },
    ignore: {
      default: false,
      type: 'array'
    },
    out: {
      aliases: ['outputDir', 'output'],
      default: Config.compiledContractsRoot,
    }
  },
  describe: 'Watch and compile changes to contracts',
  handler: watchHandler,
};

// tslint:disable-next-line: no-var-requires
const { version: pkgVersion } = require('../../package.json');

// tslint:disable-next-line: no-unused-expression
yargs
.command(compileOptions)
.command({
  command: 'config',
  describe: 'Displays current configuration options',
  handler: (argv) => {
    process.stdout.write(require('util').inspect(Config, false, null));
  }
})
.command(initOptions)
.command(linkOptions)
.command(publishOptions)
.command(versionOptions)
.command(watchOptions)
.help()
.check((argv: any): boolean => {
  if (argv._.length === 0) { yargs.showHelp(); }
  return true;
})
.usage(`Usage:\n  ${textHelpers.pkg} <publish|version> [version|major|minor|patch]`)
.epilogue(`Version: v${pkgVersion}`)
.version((): string => pkgVersion)
.argv;
