const path = require('path');
const knexLib = require('knex');

const env = process.env.NODE_ENV || 'development';
let cfg = require(path.resolve(__dirname, '../../knexfile'));

// handle ES module default export
if (cfg && cfg.default) cfg = cfg.default;

// if knexfile exports a function that takes env, call it
if (typeof cfg === 'function') {
  cfg = cfg(env);
}

// if knexfile exports an object with environments (development/test/production)
if (cfg && cfg[env]) cfg = cfg[env];

// validate
if (!cfg || (!cfg.client && !cfg.dialect)) {
  throw new Error(`Invalid knex config for env "${env}". Loaded config: ${JSON.stringify(cfg)}`);
}

module.exports = knexLib(cfg);
