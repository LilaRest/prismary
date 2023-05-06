import { expect } from 'vitest';
import { toEqualSet } from './matchers/toEqualSet';

interface CustomMatchers<R = unknown> {
  toEqualSet (arg0: Set<string>): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toEqualSet: toEqualSet
});