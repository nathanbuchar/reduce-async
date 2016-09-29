'use strict';

module.exports = function reduceAsync(arr, iteratee, done /*, initialValue*/) {

  /**
   * Validate that the first parameter is an array.
   *
   * @throws
   */
  if (!Array.isArray(arr)) {
    throw new TypeError(
      'Async reduce must be called on an array. Got "' + typeof array + '".');
  }

  /**
   * Validate that the second parameter is a function.
   *
   * @throws
   */
  if (typeof iteratee !== 'function') {
    throw new TypeError(
      '"iteratee" must be a function. Got "' + typeof iteratee + '"');
  }

  /**
   * Validate that the third parameter is a function.
   *
   * @throws
   */
  if (typeof done !== 'function') {
    throw new TypeError(
      '"done" must be a function. Got "' + typeof done + '"');
  }

  /**
   * The reduceAsync arguments.
   *
   * @type {Array}
   * @private
   */
  let _args = arguments;

  /**
   * The array to reduce.
   *
   * @type {Array}
   * @private
   */
  let _arr = Object(arr);

  /**
   * The zero-fill right shifted length of the array. Ensures that the length
   * of large arrays is always positive.
   *
   * @type {number}
   * @private
   */
  let _len = _arr.length >>> 0;

  /**
   * The starting index.
   *
   * @type {number}
   * @default 0
   * @private
   */
  let _index = 0;

  /**
   * The current value of the reduction.
   *
   * @type {any}
   * @private
   */
  let _value = (function () {
    if (_args.length > 3) {
      return _args[3];
    } else {
      while (_index < _len && !(_index in _arr)) {
        _index++;
      }

      if (_index >= _len) {
        throw new TypeError(
          'Async reduce of empty array with no initial value');
      }

      return _arr[_index++];
    }
  }());

  /**
   * The reduction iterator function. Called by the "_next" function to make
   * recusively iterative calls asynchronously.
   *
   * @param {number} n
   * @private
   */
  function _iterator(n) {
    if (n in _arr) {
      iteratee(_value, _arr[n], n, _arr, _next(n));
    } else {
      done(_value);
    }
  }

  /**
   * The reduction "next" handler. Updates the value of the reduction and makes
   * another call to the iterator if the reduction is still in progress, or
   * calls the "done" callback if the reduction has finished.
   *
   * @param {number} n
   * @returns {Function}
   * @private
   */
  function _next(n) {
    return _updateValue(() => {
      _iterator(++n);
    });
  }

  /**
   * Updates the current reduction value with that passed into the `next`
   * callback.
   *
   * @param {Function} fn
   * @returns {Function}
   * @private
   */
  function _updateValue(fn) {
    return val => {
      _value = val;
      fn();
    };
  }

  _iterator(_index);
};
