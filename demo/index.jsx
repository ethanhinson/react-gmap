/* global document */
/**
 * This file is just for demo purposes.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import makeFakeMarkers from '../demo-utils/markers';

import Map from '../src/components/map';
import GmapProvider, { useGmapDispatch } from '../src/context/provider';
import config from '../keys';

const { mapsApiKey } = config;

const GenerateMarkers = () => {
  const gmapDispatch = useGmapDispatch();
  return (
    <button
      type="submit"
      onClick={() => {
        gmapDispatch({
          type: 'SET_MARKERS',
          value: makeFakeMarkers(),
        });
      }}
    >
      Update Marker State
    </button>
  );
};

const e = document.getElementById('gmap');
ReactDOM.render(
  <GmapProvider defaultState={{
    markers: makeFakeMarkers(),
  }}
  >
    <GenerateMarkers />
    <Map apiKey={mapsApiKey} className="map" />
  </GmapProvider>, e,
);
