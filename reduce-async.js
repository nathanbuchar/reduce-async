'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function reduceAsync(arr, iteratee, done /*, initialValue*/) {

  /**
   * Validate that the first parameter is an array.
   *
   * @throws
   */
  if (!Array.isArray(arr)) {
    throw new TypeError('Async reduce must be called on an array. Got "' + (typeof array === 'undefined' ? 'undefined' : _typeof(array)) + '".');
  }

  /**
   * Validate that the second parameter is a function.
   *
   * @throws
   */
  if (typeof iteratee !== 'function') {
    throw new TypeError('"iteratee" must be a function. Got "' + (typeof iteratee === 'undefined' ? 'undefined' : _typeof(iteratee)) + '"');
  }

  /**
   * Validate that the third parameter is a function.
   *
   * @throws
   */
  if (typeof done !== 'function') {
    throw new TypeError('"done" must be a function. Got "' + (typeof done === 'undefined' ? 'undefined' : _typeof(done)) + '"');
  }

  /**
   * The reduceAsync arguments.
   *
   * @type {Array}
   * @private
   */
  var _args = arguments;

  /**
   * The array to reduce.
   *
   * @type {Array}
   * @private
   */
  var _arr = Object(arr);

  /**
   * The zero-fill right shifted length of the array. Ensures that the length
   * of large arrays is always positive.
   *
   * @type {number}
   * @private
   */
  var _len = _arr.length >>> 0;

  /**
   * The starting index.
   *
   * @type {number}
   * @default 0
   * @private
   */
  var _index = 0;

  /**
   * The current value of the reduction.
   *
   * @type {any}
   * @private
   */
  var _value = function () {
    if (_args.length > 3) {
      return _args[3];
    } else {
      while (_index < _len && !(_index in _arr)) {
        _index++;
      }

      if (_index >= _len) {
        throw new TypeError('Async reduce of empty array with no initial value');
      }

      return _arr[_index++];
    }
  }();

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
    return _updateValue(function () {
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
    return function (val) {
      _value = val;
      fn();
    };
  }

  _iterator(_index);
};
//# sourceMappingURL=reduce-async.js.map
