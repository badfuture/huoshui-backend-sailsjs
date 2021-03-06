var util = require('util')
var _ = require('lodash')
var mergeDefaults = require('merge-defaults')
var flaverr = require('flaverr')

const JSONP_CALLBACK_PARAM = 'callback'
const DEFAULT_POPULATE_LIMIT = 30

module.exports = {

  parsePopulate: (req, targetModel) => {
    const modelName = targetModel ? targetModel : req.options.model
    const modelRelations = sails.models[modelName].associations

    customInclude = req.param('populate')
    if (customInclude === 'all') {
      // do nothing and pass the string forward
    } else if (typeof customInclude === 'string') {
      // parse populate string into array
      // /model?populate=alias1,alias2,alias3
      // /model?populate=[alias1,alias2,alias3]
      customInclude = customInclude.replace(/\[|\]/g, '')
      customInclude = (customInclude) ? customInclude.split(',') : []
    }

    // dynamically call include parsing function based on model name
    const fnName = `${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Include`
    var IncludeFn = IncludeService[fnName]
    return IncludeFn(customInclude)
  },

  parseScope: (req, defaultScope) => {
    let customScope = req.param('scope');
    if (!customScope) {
      return defaultScope
    } else if (customScope === 'all') {
      return defaultScope
    } else if (typeof customScope === 'string') {
      // add support for array format
      // /model?scope=alias1,alias2,alias3
      // /model?scope=[alias1,alias2,alias3]
      customScope = customScope.replace(/\[|\]/g, '');
      customScope = (customScope) ? customScope.split(',') : [];
      if (typeof customScope === 'array' && customScope.length === 0) {
        return defaultScope
      } else {
        return customScope
      }
    }
  },

  parsePk: function ( req ) {

    var pk = req.options.id || (req.options.where && req.options.where.id) || req.param('id');

    // TODO: make this smarter...
    // (e.g. look for actual primary key of model and look for it
    //  in the absence of `id`.)
    // See coercePK for reference (although be aware it is not currently in use)

    // exclude criteria on id field
    pk = _.isPlainObject(pk) ? undefined : pk;
    return pk;
  },



  requirePk: function (req) {
    var pk = module.exports.parsePk(req);

    // Validate the required `id` parameter
    if ( !pk ) {

      var err = new Error(
      'No `id` parameter provided.'+
      '(Note: even if the model\'s primary key is not named `id`- '+
      '`id` should be used as the name of the parameter- it will be '+
      'mapped to the proper primary key name)'
      );
      err.status = 400;
      throw err;
    }

    return pk;
  },

  parseValues: function (req) {

    // Allow customizable blacklist for params NOT to include as values.
    req.options.values = req.options.values || {};
    req.options.values.blacklist = req.options.values.blacklist;

    // Validate blacklist to provide a more helpful error msg.
    var blacklist = req.options.values.blacklist;
    if (blacklist && !_.isArray(blacklist)) {
      throw new Error('Invalid `req.options.values.blacklist`. Should be an array of strings (parameter names.)');
    }

    // Merge params into req.options.values, omitting the blacklist.
    var values = mergeDefaults(req.params.all(), _.omit(req.options.values, 'blacklist'));

    // Omit values that are in the blacklist (like query modifiers)
    values = _.omit(values, blacklist || []);

    // Omit any values w/ undefined values
    values = _.omit(values, function (p){ if (_.isUndefined(p)) return true; });

    // Omit jsonp callback param (but only if jsonp is enabled)
    var jsonpOpts = req.options.jsonp && !req.isSocket;
    jsonpOpts = _.isObject(jsonpOpts) ? jsonpOpts : { callback: JSONP_CALLBACK_PARAM };
    if (jsonpOpts) {
      values = _.omit(values, [jsonpOpts.callback]);
    }

    return values;
  },


  parseModel: function (req) {
    // Ensure a model can be deduced from the request options.
    var model = req.options.model || req.options.controller;
    if (!model) { throw new Error(util.format('No "model" specified in route options.')); }

    var Model = req._sails.models[model];
    if ( !Model ) { throw new Error(util.format('Invalid route option, "model".\nI don\'t know about any models named: `%s`',model)); }

    return Model;
  },

  parsePaginate: function (req) {
    // expect a boolean value
    var paginate = req.param('paginate')
    return (paginate === true || paginate === 'true') ? true : false;
  },

  parseSort: function (req) {
    const sort = req.param('sort')
    if (_.isUndefined(sort)) {return undefined}
    const params = sort.replace( /["']/g, "").split(' ')
    return [[params[0], params[1]]]
  },

  parseSkip: function (req) {
    var DEFAULT_SKIP = req._sails.config.blueprints.defaultSkip || 0;
    var skip = req.param('skip') || DEFAULT_SKIP;
    if (skip) { skip = +skip; }
    return skip;
  },

  parseLimit: function (req) {
    var DEFAULT_LIMIT = req._sails.config.blueprints.defaultLimit || 30;
    var limit = req.param('limit') || DEFAULT_LIMIT;
    if (limit) { limit = +limit; }
    return limit;
  },

  parseWhere: function ( req ) {
    var blacklist = ['limit', 'skip', 'sort', 'populate', 'paginate', 'reviewedOnly'];
    var where = req.allParams().where;

    // If `where` parameter is a string, try to interpret it as JSON.
    // (If it cannot be parsed, throw a UsageError.)
    if (_.isString(where)) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        throw flaverr({ name: 'UsageError' }, new Error('Could not JSON.parse() the provided `where` clause. Here is the raw error: '+e.stack));
      }
    }

    // If `where` has not been specified, but other unbound parameter variables
    // **ARE** specified, build the `where` option using them.
    if (!where) {
      where = req.allParams();
      where = _.omit(where, blacklist);
      where = _.omit(where, function(p) {
        if (_.isUndefined(p)) { return true; }
      });
    }
    return where;
  },



}
