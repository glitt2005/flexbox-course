<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# now-and-later

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Map over an array or object of values in parallel or series, passing each through the async iterator, with optional lifecycle hooks.

## Usage

```js
var nal = require('now-and-later');

function iterator(value, key, cb) {
  // called with each value in sequence
  // also passes the key
  cb(null, value * 2);
}

function create(value, key) {
  // called at the beginning of every iteration
  // return a storage object to be passed to each lifecycle method
  return { key: key, value: value };
}

function before(storage) {
  // called before the iterator function of every iteration
  // receives the storage returned from `create`
}

function after(result, storage) {
  // called after a success occurs in the iterator function of any iteration
  // receives the `result` of the iterator and the storage returned from `create`
}

function error(error, storage) {
  // called after an error occurs in the iterator function of any iteration
  // receives the `error` of the iterator and the storage returned from `create`
}

function done(error, results) {
  // called after all iterations complete or an error occurs in an iterator
  // receives an `error` if one occurred and all results (or partial results upon error) of the iterators
}

/*
  Calling mapSeries with an object can't guarantee order
  It uses Object.keys to get an order
  It is better to use an array if order must be guaranteed
 */
nal.mapSeries(
  [1, 2, 3],
  iterator,
  {
    create: create,
    before: before,
    after: after,
    error: error,
  },
  done
);

nal.map(
  {
    iter1: 1,
    iter2: 2,
  },
  iterator,
  {
    create: create,
    before: before,
    after: after,
    error: error,
  },
  done
);
```

## API

### `map(values, iterator[, options][, callback])`

Takes an object or array of `values` and an `iterator` function to execute with each value.
Optionally, takes an `options` object and a `callback` function that is called upon completion of the iterations.

All iterations run in parallel.

#### `values`

An array or object of values to iterate over.

If `values` is an array, iterations are started in order by index. If `values` is an object, iterations are started in order by the order returned by `Object.keys` (order is not guaranteed).

If `values` is an array, the results of each iteration will be mapped to an array. If `values` is an object, the results of each iteration will be mapped to an object with corresponding keys.

#### `iterator(value, key, done)`

An async function called per iteration. All iterations are run in parallel.

The `iterator` function is called once with each `value`, `key` and a function (`done(error, result)`) to call when the async work is complete.

If `done` is passed an error as the first argument, the iteration will fail and the sequence will be ended; however, any iterations in progress will still complete. If `done` is passed a `result` value as the second argument, it will be added to the final results array or object.

#### `options`

The `options` object is primarily used for specifying functions that give insight into the lifecycle of each iteration. The possible extension points are `create`, `before`, `after` and `error`. If an extension point is not specified, it defaults to a no-op function.

The `options` object for `map` also allows specifying `concurrency` in which to run your iterations. By default, your iterations will run at maximum concurrency.

##### `options.concurrency`

Limits the amount of iterations allowed to run at a given time.

##### `options.create(value, key)`

Called at the very beginning of each iteration with the `value` being iterated and the `key` from the array or object. If `create` returns a value (`storage`), it is passed to the `before`, `after` and `error` extension points.

If a value is not returned, an empty object is used as `storage` for each other extension point.

This is useful for tracking information across an iteration.

##### `options.before(storage)`

Called immediately before each iteration with the `storage` value returned from the `create` extension point.

##### `options.after(result, storage)`

Called immediately after each iteration with the `result` of the iteration and the `storage` value returned from the `create` extension point.

##### `options.error(error, storage)`

Called immediately after a failed iteration with the `error` of the iteration and the `storage` value returned from the `create` extension point.

#### `callback(error, results)`

A function that is called after all iterations have completed or one iteration has errored.

If all iterations completed successfully, the `error` argument will be empty and the `results` will be a mapping of the `iterator` results.

If an iteration errored, the `error` argument will be passed from that iteration and the `results` will be whatever partial results had completed successfully before the error occurred.

### `mapSeries(values, iterator[, options][, callback])`

Takes an object or array of `values` and an `iterator` function to execute with each value.
Optionally, takes an `options` object and a `callback` function that is called upon completion of the iterations.

All iterations run in serial.

#### `values`

An array or object of values to iterate over.

If `values` is an array, iterations are started in order by index. If `values` is an object, iterations are started in order by the order returned by `Object.keys` (order is not guaranteed).

If `values` is an array, the results of each iteration will be mapped to an array. If `values` is an object, the results of each iteration will be mapped to an object with corresponding keys.

#### `iterator(value, key, done)`

An async function called per iteration. All iterations are run in serial.

The `iterator` function is called once with each `value`, `key` and a function (`done(error, result)`) to call when the async work is complete.

If `done` is passed an error as the first argument, the iteration will fail and the sequence will be ended without executing any more iterations. If `done` is passed a `result` value as the second argument, it will be added to the final results array or object.

#### `options`

The `options` object is primarily used for specifying functions that give insight into the lifecycle of each iteration. The possible extension points are `create`, `before`, `after` and `error`. If an extension point is not specified, it defaults to a no-op function.

##### `options.create(value, key)`

Called at the very beginning of each iteration with the `value` being iterated and the `key` from the array or object. If `create` returns a value (`storage`), it is passed to the `before`, `after` and `error` extension points.

If a value is not returned, an empty object is used as `storage` for each other extension point.

This is useful for tracking information across an iteration.

##### `options.before(storage)`

Called immediately before each iteration with the `storage` value returned from the `create` extension point.

##### `options.after(result, storage)`

Called immediately after each iteration with the `result` of the iteration and the `storage` value returned from the `create` extension point.

##### `options.error(error, storage)`

Called immediately after a failed iteration with the `error` of the iteration and the `storage` value returned from the `create` extension point.

#### `callback(error, results)`

A function that is called after all iterations have completed or one iteration has errored.

If all iterations completed successfully, the `error` argument will be empty and the `results` will be a mapping of the `iterator` results.

If an iteration errored, the `error` argument will be passed from that iteration and the `results` will be whatever partial results had completed successfully before the error occurred.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/now-and-later.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/now-and-later
[npm-image]: https://img.shields.io/npm/v/now-and-later.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/now-and-later/actions?query=workflow:dev
[ci-image]: https://img.shields.io/github/workflow/status/gulpjs/now-and-later/dev?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/now-and-later
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/now-and-later/master.svg?style=flat-square
<!-- prettier-ignore-end -->
