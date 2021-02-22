import assert from 'assert';
import { linkEventsToPOI, linkEventsToPOI2, clusterize } from '../src/utils.js';

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
const DIAMETER = 1500;

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

describe('linkEventsToPOI2', () => {
  const CLUSTERS = {
    0: {
      lat: 48.00001,
      lon: 2,
      impressions: 0,
      clicks: 2,
      points: [
        {
          lat: 48.00000,
          lon: 2,
          event_type: 'click',
        },
        {
          lat: 48.00002,
          lon: 2,
          event_type: 'click',
        },
      ],

    },
  };
  it('should respect output format', () => {
    const expected = {
      PoiName1: {
        lat: 48,
        lon: 2,
        name: 'PoiName1',
        impressions: 0,
        clicks: 2,
      },
      PoiName2: {
        lat: 50,
        lon: 3,
        name: 'PoiName2',
        impressions: 0,
        clicks: 0,
      },
    };

    const res = linkEventsToPOI2(CLUSTERS, INPUT, DIAMETER);
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
    const res = linkEventsToPOI2({}, INPUT, DIAMETER);
    assert.deepEqual(res, expected);
  });
  it('should return an empty object if no input', () => {
    const res = linkEventsToPOI2({}, [], DIAMETER);
    assert.deepEqual(res, {});
  });
  it('should return an empty object if no input', () => {
    const res = linkEventsToPOI2(CLUSTERS, [], DIAMETER);
    assert.deepEqual(res, {});
  });
  it('should be ok with close entry pois', () => {
    const input = [
      {
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      {
        lat: 48.88567,
        lon: 2.26326,
        name: 'Paris',
      },
    ];
    const data = [
      {
        lat: 48.89111120714,
        lon: 2.2328462923715,
        event_type: 'imp',
      }, {
        lat: 48.888450965046,
        lon: 2.2470618097659,
        event_type: 'click',
      },
    ];
    const cluster = {
      0: {
        lat: 48.889781,
        lon: 2.239954,
        points: data,
        impressions: 1,
        clicks: 1,
      },
    };
    const expected = {
      LaFolie: {
        clicks: 0,
        impressions: 1,
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      Paris: {
        clicks: 1,
        impressions: 0,
        lat: 48.88567,
        lon: 2.26326,
        name: 'Paris',
      },
    };
    const res = linkEventsToPOI2(cluster, input, DIAMETER);
    assert.deepEqual(res, expected);
  });
  it('should be ok with aligned entry pois', () => {
    const input = [
      {
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      {
        lat: 48.89420,
        lon: 2.22495,
        name: 'RER',
      },
    ];
    const data = [
      {
        lat: 48.89111120714,
        lon: 2.2328462923715,
        event_type: 'imp',
      }, {
        lat: 48.888450965046,
        lon: 2.2470618097659,
        event_type: 'click',
      },
    ];
    const cluster = {
      0: {
        lat: 48.889781,
        lon: 2.239954,
        points: data,
        impressions: 1,
        clicks: 1,
      },
    };
    const expected = {
      LaFolie: {
        clicks: 0,
        impressions: 0,
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      RER: {
        clicks: 1,
        impressions: 1,
        lat: 48.89420,
        lon: 2.22495,
        name: 'RER',
      },
    };
    const res = linkEventsToPOI2(cluster, input, DIAMETER);
    assert.deepEqual(res, expected);
  });
  it('should be ok with one poi as cluster', () => {
    const clusterLatLon = {
      lat: 48.889781,
      lon: 2.239954,
    };
    const input = [
      {
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      {
        ...clusterLatLon,
        name: 'defense',
      },
    ];
    const data = [
      {
        lat: 48.89111120714,
        lon: 2.2328462923715,
        event_type: 'imp',
      }, {
        lat: 48.888450965046,
        lon: 2.2470618097659,
        event_type: 'click',
      },
    ];
    const cluster = {
      0: {
        ...clusterLatLon,
        points: data,
        impressions: 1,
        clicks: 1,
      },
    };
    const expected = {
      LaFolie: {
        clicks: 0,
        impressions: 0,
        lat: 48.89695,
        lon: 2.21794,
        name: 'LaFolie',
      },
      defense: {
        clicks: 1,
        impressions: 1,
        lat: 48.889781,
        lon: 2.239954,
        name: 'defense',
      },
    };
    const res = linkEventsToPOI2(cluster, input, DIAMETER);
    assert.deepEqual(res, expected);
  });
});

describe('clusterize', () => {
  it('should return a cluster in middle of 2 points', () => {
    const data = [
      {
        lat: 48.0,
        lon: 2.0,
        event_type: 'imp',
      }, {
        lat: 48.01,
        lon: 2.0,
        event_type: 'click',
      },
    ];
    const expected = {
      0: {
        lat: 48.005,
        lon: 2.0,
        points: data,
        impressions: 1,
        clicks: 1,
      },
    };
    const c = clusterize(data, DIAMETER);
    assert.deepEqual(c, expected);
  });
  it('should return a cluster in middle of 3 points', () => {
    const data = [
      {
        lat: 48.0,
        lon: 2.0,
        event_type: 'imp',
      }, {
        lat: 48.01,
        lon: 2.0,
        event_type: 'click',
      }, {
        lat: 48.005,
        lon: 2.01,
        event_type: 'click',
      },
    ];
    const expected = {
      0: {
        lat: 48.005,
        lon: 2.005,
        points: data,
        impressions: 1,
        clicks: 2,
      },
    };
    const c = clusterize(data, DIAMETER);
    assert.deepEqual(c, expected);
  });
});
