import assert from 'assert';
import { linkEventsToPOI } from '../src/utils.js';

const INPUT = [
  {
    lat: 48,
    lon: 2,
    name: 'PoiName1',
  },
  {
    lat: 50,
    lon: 3,
    name: 'PoiName2',
  },
];

describe('linkEventsToPOI', () => {
  const DATA = [
    {
      lat: 48.00001,
      lon: 2,
      event_type: 'imp',
    },
    {
      lat: 48.00002,
      lon: 2,
      event_type: 'click',
    },
  ];

  it('should respect output format', () => {
    const expected = {
      PoiName1: {
        lat: 48,
        lon: 2,
        name: 'PoiName1',
        impressions: 1,
        clicks: 1,
      },
      PoiName2: {
        lat: 50,
        lon: 3,
        name: 'PoiName2',
        impressions: 0,
        clicks: 0,
      },
    };

    const res = linkEventsToPOI(DATA, INPUT);
    assert.deepEqual(res, expected);
  });
  it('should return even if no data', () => {
    const expected = {
      PoiName1: {
        lat: 48,
        lon: 2,
        name: 'PoiName1',
        impressions: 0,
        clicks: 0,
      },
      PoiName2: {
        lat: 50,
        lon: 3,
        name: 'PoiName2',
        impressions: 0,
        clicks: 0,
      },
    };
    const res = linkEventsToPOI([], INPUT);
    assert.deepEqual(res, expected);
  });
  it('should return an empty object if no input', () => {
    const res = linkEventsToPOI([], []);
    assert.deepEqual(res, {});
  });
  it('should return an empty object if no input', () => {
    const res = linkEventsToPOI(DATA, []);
    assert.deepEqual(res, {});
  });
});
