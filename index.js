
/**
 * Promisify `item`.
 *
 * @param {Function|Object} item 
 * @return {Function|Object}
 * @api public
 */

exports = module.exports = function(item){
  return 'object' == typeof item
    ? map(item)
    : promisify(item);
};

/**
 * Exports.
 */

exports.map = map;
exports.promisify = promisify;

/**
 * Promisify all function methods in `captured`.
 *
 * @param {Object} captured
 * @return {Object} promisified
 * @api public
 */

function map(captured){
  var obj = {};
  for (var key in captured){
    var prop = captured[key];
    if ('function' == typeof prop) {
      obj[key] = promisify(prop.bind(captured));
    }
  }
  return obj;
}

/**
 * Convert a callback based api to promise based.
 *
 * @param {Function} captured
 * @return {Function} promisified
 * @api public
 */

function promisify(captured){
  return function(){
    /**
     * Promise object.
     */

    var promise = {};

    /**
     * To check whether it's a promise.
     */

    promise.isPromise = true;

    /**
     * Attach methods.
     */

    promise.resolve = resolve;
    promise.when = when;

    /**
     * Arguments.
     */

    var args = [].slice.call(arguments);

    /**
     * Promise arguments count.
     */

    var count = null;

    /**
     * Resolve callback.
     */

    var cb = null;

    /**
     * Resolve promise.
     */
    
    function resolve(error, value){
      promise.error = error;
      promise.value = value;
      if (cb) cb(error, value);
    }

    /**
     * Function to call when resolved.
     */
    
    function when(fn){
      setTimeout(function(){
        cb = fn;
        if ('value' in promise) {
          cb(promise.error, promise.value);
        }
      }, 0);
    }

    /**
     * Call captured function or
     * abandon with `error`.
     */
    
    function next(error){
      if (error) return promise.resolve(error);
      args.push(promise.resolve);
      captured.apply(this, args);
    }

    /**
     * Look for promises in arguments
     * and resolve them first.
     */
    
    args.forEach(function(p, i){
      if (p.isPromise) {
        count++;
        p.when(function(error, value){
          if (promise.error) return; // ignore
          if (error) return next(error);
          args[i] = value;
          --count || next();
        });
      }
    });

    /**
     * No promise arguments found, proceed immediately.
     */

    if (null === count) next();

    return promise;
  };
};
