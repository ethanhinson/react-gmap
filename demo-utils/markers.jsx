/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';
import { makeInfoWindow } from '../src/lib';

const DemoInfoWindow = ({ id, title, image }) => (
  <div className="demo-infowindow">
    <h4>{`${title} - ${id}`}</h4>
    <img alt={title} src={image} />
  </div>
);

DemoInfoWindow.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

/**
 * Don't import this function/file into the production bundle.
 * Faker is huge! (Like over 1mb...)
 * @param amount
 * @returns {{id: *, title: *, coords: {lat: number, lng: number}}[]}
 */
const makeFakerMarkers = (amount = 50) => [...Array(amount).keys()].map(() => ({
  id: faker.random.uuid(),
  title: faker.random.word(),
  image: faker.image.imageUrl(),
  coords: {
    lat: parseFloat(faker.address.latitude()),
    lng: parseFloat(faker.address.longitude()),
  },
  onClick: (e, map, props) => { makeInfoWindow(e, map, props, DemoInfoWindow); },
}));

export {
  makeFakerMarkers,
  DemoInfoWindow,
};
