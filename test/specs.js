/* global describe, it */

'use strict';

const chai = require('chai');

const reduceAsync = require('../reduce-async');

const expect = chai.expect;
const should = chai.should();

describe('reduceAsync', () => {

  describe('interface', () => {

    it('should throw if the first parameter is not an array', () => {
      expect(() => {
        reduceAsync(false);
      }).to.throw(TypeError, /must be called on an array/);
    });

    it('should throw if the second parameter is not a function', () => {
      expect(() => {
        reduceAsync([], false);
      }).to.throw(TypeError, /must be a function/);
    });

    it('should throw if the third parameter is not a function', () => {
      expect(() => {
        reduceAsync([], () => {}, false);
      }).to.throw(TypeError, /must be a function/);
    });

    it('should throw if the first parameter is an empty array and no initial value is specified', () => {
      expect(() => {
        reduceAsync([], () => {}, () => {});
      }).to.throw(TypeError, /empty array with no initial value/);
    });
  });

  describe('iterator', () => {

    it('should immediately return the first value in the array if the array has a length of 1 and the accumulator is called without an initial value', done => {
      const _arr = ['foo'];

      reduceAsync(_arr, (prev, curr, n, arr, next) => {
        const err = new Error('iteratee should not be called');
        done(err);
      }, result => {
        expect(result).to.equal(_arr[0]);
        done();
      });
    });

    it('should wait until the current iteration invokes the "next" callback before iterating to the next step', done => {
      const _arr = ['foo', 'bar', 'baz'];
      const _delay = 250;
      const _startTime = new Date();

      reduceAsync(_arr, (prev, curr, n, arr, next) => {
        setTimeout(() => {
          const _stepTime = new Date();
          const _deltaTime = _stepTime - _startTime;

          expect(_deltaTime).to.be.at.least(_delay * n).and.to.be.below(_delay * (n + 1));
          next();
        }, _delay);
      }, result => {
        const _endTime = new Date();
        const _deltaTime = _endTime - _startTime;

        expect(_deltaTime).to.be.above((_arr.length - 1) * _delay).and.below(_arr.length * _delay);
        done();
      });
    });

    it('should skip empty items in the array', done => {
      const _arr = ['foo', 'bar', , 'baz'];
      let _step = 0;

      reduceAsync(_arr, (prev, curr, n, arr, next) => {
        _step++;
        next();
      }, () => {
        expect(_step).to.equal(_arr.length - 2);
        done();
      });
    });
  });

  describe('iteratee', () => {

    describe('prev', () => {

      it('should be equal to the first value in the array during the first step if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz'];
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(prev).to.equal(_arr[0]);
          }

          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the initial value during the first step if it is specified', done => {
        const _arr = ['bar', 'baz'];
        const _initialValue = 'foo';
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(prev).to.equal(_initialValue);
          }

          next();
        }, result => {
          done();
        }, _initialValue);
      });

      it('should be equal to the value passed into the "next" function of the previous step', done => {
        const _arr = ['foo', 'baz', 'baz'];
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step === 0) {
            expect(prev).to.equal(_arr[0]);
          } else {
            expect(prev).to.equal(_step);
          }

          next(++_step);
        }, result => {
          done();
        });
      });
    });

    describe('curr', () => {

      it('should be equal to the second value in the array during the first step if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz'];
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(curr).to.equal(_arr[1]);
          }

          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the first value in the array during the first step if an initial value is specified', done => {
        const _arr = ['bar', 'baz'];
        const _initialValue = 'foo';
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(curr).to.equal(_arr[0]);
          }

          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });

    describe('n', () => {

      it('should start at 1 if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz'];
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          expect(n).to.equal(++_step);
          next();
        }, result => {
          done();
        });
      });

      it('should start at 0 if an initial value is specified', done => {
        const _arr = ['bar', 'baz'];
        const _initialValue = 'foo';
        let _step = 0;

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          expect(n).to.equal(_step++);
          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });

    describe('arr', () => {

      it('should be equal to the given array', done => {
        const _arr = ['foo', 'bar', 'baz'];

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          expect(arr).to.deep.equal(_arr);
          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the given array without the initial value when specified', done => {
        const _arr = ['bar', 'baz'];
        const _initialValue = 'foo';

        reduceAsync(_arr, (prev, curr, n, arr, next) => {
          expect(arr).to.deep.equal(_arr);
          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });
  });

  describe('done', () => {

    it('should be called with the results of the reduce', done => {
      const _arr = ['foo', 'bar', 'baz'];

      reduceAsync(_arr, (prev, curr, n, arr, next) => {
        next(prev + curr);
      }, result => {
        expect(result).to.equal('foobarbaz');
        done();
      });
    });

    it('should be called with the results of the reduce when an initial value is specified', done => {
      const _arr = ['bar', 'baz'];
      const _initialValue = 'foo';

      reduceAsync(_arr, (prev, curr, n, arr, next) => {
        next(prev + curr);
      }, result => {
        expect(result).to.equal('foobarbaz');
        done();
      }, _initialValue);
    });
  });
});
