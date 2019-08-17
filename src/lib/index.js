/* global google */
/**
 * Fit bounds on the map object based on the markers.
 * @param map
 * @param markers
 */
const fitBoundsSideEffect = (map, markers) => {
  const bounds = new google.maps.LatLngBounds();
  markers.forEach(m => bounds.extend(m.getPosition()));
  google.maps.event.trigger(map, 'resize');
  map.fitBounds(bounds);
};

/**
 * Calculate which markers/results need to added or removed from
 * the map.
 *
 * @param oldMarkers
 * @param newMarkers
 * @returns {{remove: *[], add: T[]}}
 */
const calculateMarkers = (oldMarkers, newMarkers) => {
  // do something.
  console.log(oldMarkers, newMarkers);
};

export {
  fitBoundsSideEffect,
  calculateMarkers,
};
