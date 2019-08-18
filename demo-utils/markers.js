/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';

/**
 * Don't import this function/file into the production bundle.
 * Faker is huge! (Like over 1mb...)
 * @param amount
 * @returns {{id: *, title: *, coords: {lat: number, lng: number}}[]}
 */
const makeFakerMarkers = (amount = 5000) => [...Array(amount).keys()].map(() => ({
  id: faker.random.uuid(),
  title: faker.random.word(),
  coords: {
    lat: parseFloat(faker.address.latitude()),
    lng: parseFloat(faker.address.longitude()),
  },
}));

export {
  makeFakerMarkers as default,
};
