/* global window */
import React, { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual, omit, functions } from 'lodash';
import MarkerClusterer from '@google/markerclustererplus';
import { useGmap } from '../context/provider';
import { arrayDiff, noop, makeMarker } from '../lib';

/**
 * Provide a helper function for determining if the props
 * deep equal each other.
 * @param prevProps
 * @param nextProps
 * @returns {*}
 */
const mapWillUpdate = (prevProps, nextProps) => {
  const [prevFuncs, nextFuncs] = [functions(prevProps), functions(nextProps)];
  return (
    isEqual(omit(prevProps, prevFuncs), omit(nextProps, nextFuncs))
      && prevFuncs.every(fn => prevProps[fn].toString() === nextProps[fn].toString())
  );
};

/**
 * This is a static cache of the marker IDs
 * that are present on the map. We use
 * this list to determine which markers
 * to remove as a side effect.
 */
const markerStaticCache = {};

/**
 * Perform a difference check on the set
 * of ids. Turn off any missing markers
 * and return the new set to be
 * used.
 * @param map
 * @param visibleIds
 */
const handleMarkersSideEffect = (map, visibleIds) => {
  const markersToHide = arrayDiff(Object.keys(markerStaticCache), visibleIds);
  markersToHide
  // For the marker Ids that are missing, we setMap to null, otherwise noop
    .forEach(id => (markerStaticCache[id] ? markerStaticCache[id].setMap(null) : noop));
};


/**
 * Fit bounds on the map object based on the markers.
 * @param map
 * @param markers
 */
const fitBoundsSideEffect = (map, markers) => {
  if (markers.length) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(m => (m.getMap() ? bounds.extend(m.getPosition()) : noop));
    window.google.maps.event.trigger(map, 'resize');
    map.fitBounds(bounds);
  }
};

const Map = ({
  options, className, apiKey, clusterOptions,
}) => {
  const mapRef = { ref: useRef(), className };
  const [gmapState, gmapDispatch] = useGmap();
  const { map, markers, cluster } = gmapState;

  /**
   * useEffect callback.
   *
   * This should only be invoked on the
   * first load of the component.
   */
  const onMapsAPILoad = () => {
    const mapObj = new window.google.maps.Map(mapRef.ref.current, options);
    gmapDispatch({
      type: 'SET_MAP',
      value: mapObj,
    });
  };

  /**
   * useEffect callback.
   *
   * This should be invoked on state updates. It handles
   * calculating which markers should be hidden
   * on the map. Since GoogleMaps has only
   * an imperative API, we have to "remember"
   * which markers were visible and which
   * are not.
   *
   * The style is a little old school.
   * But precision, and performance are
   * important here.
   */
  const handleMapUpdates = () => {
    const visibleMapIds = [];
    const visibleMapMarkers = [];
    markers.forEach((m) => {
      const { id } = m;
      visibleMapIds.push(id);
      if (!markerStaticCache[id]) {
        markerStaticCache[id] = makeMarker(map, m);
      }
      visibleMapMarkers.push(markerStaticCache[id]);
    });
    if (clusterOptions && !cluster) {
      gmapDispatch({
        type: 'SET_CLUSTER',
        value: new MarkerClusterer(map, visibleMapMarkers, clusterOptions),
      });
    }
    handleMarkersSideEffect(map, visibleMapIds);
    fitBoundsSideEffect(map, visibleMapMarkers);
  };

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=${apiKey}`;
      const headScript = document.getElementsByTagName('script')[0];
      headScript.parentNode.insertBefore(script, headScript);
      script.addEventListener('load', onMapsAPILoad);
      return () => script.removeEventListener('load', onMapsAPILoad);
    } handleMapUpdates(); return undefined;
  });

  return (
    <div
      {...mapRef}
    />
  );
};

Map.propTypes = {
  options: PropTypes.shape({}),
  apiKey: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  clusterOptions: PropTypes.shape({}),
};

Map.defaultProps = {
  clusterOptions: undefined,
  options: {
    center: { lat: 48, lng: 8 },
    zoom: 5,
  },
};

// Provide the memoized map by default.
const MemoMap = memo(Map, mapWillUpdate);

export {
  MemoMap as default,
};
