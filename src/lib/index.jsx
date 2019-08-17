/* global google */
/**
 * Fit bounds on the map object based on the markers.
 * @param map
 * @param markers
 */
const fitBoundsSideEffect = (map, markers) => {
  if (markers.length) {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.getPosition()));
    google.maps.event.trigger(map, 'resize');
    map.fitBounds(bounds);
  }
};

/**
 * Provide a function to create a marker object.
 * @param map
 * @param title
 * @param coords
 * @param data
 * @param onClick
 * @returns {window.google.maps.Marker}
 */
const makeMarker = (map, {
  title, coords, data, onClick,
}) => {
  const marker = new window.google.maps.Marker({
    position: coords,
    map,
    title,
    data,
  });
  marker.addListener('click', e => (onClick ? onClick(e, map, data) : null));
  return marker;
};

export {
  fitBoundsSideEffect,
  makeMarker,
};
