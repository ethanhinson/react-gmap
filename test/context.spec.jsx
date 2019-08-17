/* eslint-env jest */
import { reducer, initialState } from '../src/context/provider';

describe('State reducer', () => {
  it('Properly sets the gmap object instance', () => {
    const newState = reducer(initialState, {
      type: 'SET_MAP',
      value: {
        a: 'Map',
      },
    });
    expect(newState).toStrictEqual({
      ...initialState,
      map: {
        a: 'Map',
      },
    });
  });
});
