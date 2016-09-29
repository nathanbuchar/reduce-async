ReduceAsync [![Build Status](https://travis-ci.org/nathanbuchar/reduce-async.svg?branch=master)](https://travis-ci.org/nathanbuchar/reduce-async)
===========

Asynchronous `Array.reduce`. The [`reduce()`][external_mdn_reduce] method applies a function against an accumulator and each value of the array (from left-to-right) to reduce it to a single value.



***



### Installation

```bash
$ npm install reduce-async
```


### Syntax

```
arrayReduce(array, iteratee, done[, initialValue])
```

**Parameters**

* **`array`** *Array* - The array to reduce.

* **`iteratee`** *Function* - The function to execute on each value in the array, taking five arguments:
  * `prev` *Any* - The value previously returned in the last invocation of the iteratee, or `initialValue` if supplied. (See below.)

  * `curr` *Any* - The current element being processed in the array.

  * `n` *Integer* - The index of the current element being processed in the array. Start at index 0, if an `initialValue` is provided, and at index 1 otherwise.

  * `arr` *Array* - The array `reduceAsync` was called upon.

  * `next` *Function* - The function to call when you are ready to advance to the next element in the array.

* **`done`** *Function* - The function called when the reduce has finished.

* **`initialValue`** *Any* (Optional) - Value to use as the first argument to the first call of the `iteratee`.

[More information][external_mdn_reduce] on how `reduce` works.


### Examples

* Asynchronously sum all the values of an array.

  ```js
  reduceAsync([0, 1, 2, 3], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev + curr);
    });
  }, result => {
    // result == 6
  }));
  ```

* Asynchronously flatten an array of arrays,

  ```js
  reduceAsync([[0, 1], [2, 3], [4, 5]], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev.concat(curr));
    });
  }, result => {
    // result is [0, 1, 2, 3, 4, 5]
  }));
  ```

* Asynchronously concatenate all words within an array together starting from an initial value of `"foo"`.

  ```js
  reduceAsync(['bar', 'baz']], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev + curr);
    });
  }, result => {
    // result is "foobarbaz"
  }, 'foo'));
  ```



***



Authors
-------
* [Nathan Buchar]


License
-------
IST






[external_mdn_reduce]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

[Nathan Buchar]: mailto:hello@nathanbuchar.com
