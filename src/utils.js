import geolib from 'geolib';

const { getDistance } = geolib;

/**
 * Links points within data to closest poi
 * @param {point[]} data
 * @param {point_of_interest[]} inputArray points of interest we want to associate data to
 * @returns {Object} the point of interest with associated clicks and impressions
 */
function linkEventsToPOI(data, inputArray) {
  if (inputArray.length === 0) {
    return {};
  }

  const dictPOI = {};
  inputArray.forEach((element) => {
    dictPOI[element.name] = { ...element, impressions: 0, clicks: 0 };
  });

  data.forEach((row) => {
    let minDist = Number.MAX_VALUE;
    let closest;
    inputArray.forEach((element) => {
      const dist = getDistance(element, row);
      if (dist < minDist) {
        minDist = dist;
        closest = element.name;
      }
    });
    switch (row.event_type) {
      case 'imp':
        dictPOI[closest].impressions += 1;
        break;
      case 'click':
        dictPOI[closest].clicks += 1;
        break;
      default:
        console.error(`wrong event_type ${row.event_type} found within data`);
        break;
    }
  });

  return dictPOI;
}

export {
  linkEventsToPOI,
};
