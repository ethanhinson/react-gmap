/* global window */
import { memoize } from 'lodash';

/**
 * Fit bounds on the map object based on the markers.
 * @param map
 * @param markers
 */
const fitBoundsSideEffect = (map, markers) => {
  if (markers.length) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.getPosition()));
    window.google.maps.event.trigger(map, 'resize');
    map.fitBounds(bounds);
  }
};

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

export {
  fitBoundsSideEffect,
  makeMarker,
};
