/* global window */
import React, { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual, omit, functions } from 'lodash';
import MarkerClusterer from '@google/markerclustererplus';
import { useGmap } from '../context/provider';
import { noop, makeMarker } from '../lib';

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

const Map = ({
  options, className, clusterOptions, mapId,
}) => {
  const mapRef = { ref: useRef(), className };
  const [gmapState, gmapDispatch] = useGmap();
  const mapInternalState = gmapState[mapId] || {};

  const {
    map, markers, cluster,
  } = mapInternalState;

  /**
   * Perform a difference check on the set
   * of ids. Turn off any missing markers
   * and return the new set to be
   * used.
   * @param visibleIds
   */
  const handleMarkersSideEffect = (visibleIds) => {
    Object.keys(markerStaticCache[mapId])
      .forEach((id) => {
        if (visibleIds.indexOf(id) === -1) {
          markerStaticCache[mapId][id].setMap(null);
        } else {
          noop();
        }
      });
  };

  /**
   * Fit bounds on the map object based on the markers.
   * @param newMarkers
   */
  const fitBoundsSideEffect = (newMarkers) => {
    if (newMarkers.length) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(m => (m.getMap() ? bounds.extend(m.getPosition()) : noop));
      map.fitBounds(bounds);
    }
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
    if (!markerStaticCache[mapId]) {
      markerStaticCache[mapId] = {};
    }
    markers.forEach((m) => {
      const { id } = m;
      visibleMapIds.push(id);
      if (!markerStaticCache[mapId][id]) {
        markerStaticCache[mapId][id] = makeMarker(map, m);
      }
      visibleMapMarkers.push(markerStaticCache[mapId][id]);
    });
    handleMarkersSideEffect(visibleMapIds);
    fitBoundsSideEffect(visibleMapMarkers);
    if (clusterOptions && !cluster) {
      gmapDispatch({
        type: 'SET_CLUSTER',
        value: new MarkerClusterer(map, visibleMapMarkers, clusterOptions),
        id: mapId,
      });
    }
    if (cluster) {
      cluster.clearMarkers();
      cluster.addMarkers(visibleMapMarkers);
    }

    window.google.maps.event.trigger(map, 'resize');
  };

  // Runs on mount/unmount
  useEffect(() => {
    const mapObj = new window.google.maps.Map(mapRef.ref.current, options);
    gmapDispatch({
      type: 'SET_MAP',
      value: mapObj,
      id: mapId,
    });
    return () => {
      gmapDispatch({
        type: 'SET_MAP',
        value: null,
        id: mapId,
      });
    };
  }, []);

  // Runs on every update
  useEffect(() => {
    if (map) {
      handleMapUpdates();
    }
  });

  return (
    <div
      {...mapRef}
    />
  );
};

Map.propTypes = {
  options: PropTypes.shape({}),
  mapId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  clusterOptions: PropTypes.shape({}),
};

Map.defaultProps = {
  clusterOptions: undefined,
  options: {
    center: { lat: 48, lng: 8 },
    zoom: 5,
    maxZoom: 0,
  },
};

// Provide the memoized map by default.
const MemoMap = memo(Map, mapWillUpdate);

export {
  MemoMap as default,
};
