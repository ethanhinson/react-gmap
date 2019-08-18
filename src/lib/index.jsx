/* global window */
import { memoize } from 'lodash';

/**
 * Provide a function to create a marker object.
 * @param map
 * @param id
 * @param title
 * @param coords
 * @param data
 * @param onClick
 * @returns {window.google.maps.Marker}
 */
const makeMarker = memoize((map, {
  id, title, coords, data, onClick,
}) => {
  const marker = new window.google.maps.Marker({
    position: coords,
    map,
    title,
    rawData: {
      id,
      data,
    },
  });
  marker.addListener('click', e => (onClick ? onClick(e, map, data) : null));
  return marker;
}, (map, { ...args }) => JSON.stringify(args));

/**
 * Get the difference between 2 arrays.
 * @param a
 * @param b
 * @returns {*}
 */
const arrayDiff = (a, b) => a.filter(i => b.indexOf(i) < 0);

/**
 * Generic noop function.
 */
const noop = () => {};

export {
  arrayDiff,
  noop,
  makeMarker,
};
