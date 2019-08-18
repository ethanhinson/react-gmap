/* global window, document */
import React from 'react';
import { render } from 'react-dom';
import { memoize } from 'lodash';

/**
 * Handle open infowindows.
 * @param id
 * @param coords
 * @param props
 * @param Component
 */
let lastInfoWindow;
const makeInfoWindow = (e, map, props, Component) => {
  const { id } = props;
  const { latLng } = e;
  const infoWindow = new window.google.maps.InfoWindow({
    content: `<div id="infowindow-${id}" />`,
    position: { lat: latLng.lat(), lng: latLng.lng() },
  });
  infoWindow.addListener('domready', () => {
    render(
      <Component {...props} />,
      document.getElementById(`infowindow-${id}`),
    );
  });
  if (lastInfoWindow) lastInfoWindow.close();
  lastInfoWindow = infoWindow;
  infoWindow.open(map);
};

/**
 * Provide a function to create a marker object.
 * @param map
 * @param data
 * @returns {window.google.maps.Marker}
 */
const makeMarker = memoize((map, data) => {
  const {
    title, coords, onClick,
  } = data;
  const marker = new window.google.maps.Marker({
    position: coords,
    map,
    title,
    data,
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
  makeInfoWindow,
};
