/* global window */
import React, { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual, omit, functions } from 'lodash';
import { useGmap } from '../context/provider';
import { fitBoundsSideEffect, makeMarker } from '../lib';

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

const Map = ({ options, className, apiKey }) => {
  const mapRef = { ref: useRef(), className };
  const [gmapState, gmapDispatch] = useGmap();
  const { map, markers } = gmapState;

  // Invoked as a side effect on (presumably) the first load,
  const onMapsAPILoad = () => {
    const mapObj = new window.google.maps.Map(mapRef.ref.current, options);
    gmapDispatch({
      type: 'SET_MAP',
      value: mapObj,
    });
  };

  // Invoke side effects for map updates here.
  const handleMapUpdates = () => {
    fitBoundsSideEffect(map, markers.map(m => makeMarker(map, m)));
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
};

Map.defaultProps = {
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
