
/**
 * Convert a callback based api to promise based.
 *
 * @param {Function} capturedfn
 * @return {Function} promisified
 * @api public
 */

module.exports = function(capturedfn){
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
      capturedfn.apply(this, args);
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
