/* global document */
/**
 * This file is just for demo purposes.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { makeFakerMarkers } from '../demo-utils/markers';

import Map from '../src/components/map';
import GmapProvider, { useGmapDispatch } from '../src/context/provider';

const GenerateMarkers = ({ mapId }) => {
  const gmapDispatch = useGmapDispatch();
  return (
    <button
      type="submit"
      onClick={() => {
        gmapDispatch({
          type: 'SET_MARKERS',
          id: mapId,
          value: makeFakerMarkers(),
        });
      }}
    >
      {`Update marker state for: ${mapId}`}
    </button>
  );
};

GenerateMarkers.propTypes = {
  mapId: PropTypes.string.isRequired,
};

const e = document.getElementById('gmap');
ReactDOM.render(
  <GmapProvider defaultState={{
    gmap1: {
      markers: makeFakerMarkers(),
    },
  }}
  >
    <GenerateMarkers mapId="gmap1" />
    <Map
      clusterOptions={{
        gridSize: 100,
        maxZoom: 17,
      }}
      mapId="gmap1"
      className="map"
    />
  </GmapProvider>, e,
);


const e2 = document.getElementById('gmap2');
ReactDOM.render(
  <GmapProvider defaultState={{
    gmap2: {
      markers: makeFakerMarkers(),
    },
  }}
  >
    <GenerateMarkers mapId="gmap2" />
    <Map
      mapId="gmap2"
      className="map"
    />
  </GmapProvider>, e2,
);
