import geolib from 'geolib';

const { getDistance, getCenterOfBounds } = geolib;

/**
 * Links points within data to closest poi (BrutForce)
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

/**
 * Links points within data to closest poi
 * @param {Object} clusters a dictionary containing all clusters
 * @param {point_of_interest[]} inputArray points of interest we want to associate data to
 * @param {Number} clusterDiameter
 * @returns {Object} the point of interest with associated clicks and impressions
 */
function linkEventsToPOI2(clusters, inputArray, clusterDiameter) {
  if (inputArray.length === 0) {
    return {};
  }

  const dictPOI = {};
  inputArray.forEach((element) => {
    dictPOI[element.name] = { ...element, impressions: 0, clicks: 0 };
  });
  // going through clusters
  Object.keys(clusters).forEach((clusterName) => {
    const c = clusters[clusterName];
    let minDist = Number.MAX_VALUE;
    let closest;
    let queue = {};
    let unsure = false;
    // going through POIs
    inputArray.forEach((element) => {
      const distPCentre = getDistance(element, c);
      const distMaxPCercle = distPCentre + clusterDiameter / 2;

      if (distPCentre < minDist) {
        if (distMaxPCercle < minDist - clusterDiameter / 2) {
          queue = {};
        } else {
          unsure = true;
        }
        minDist = distPCentre;
        closest = element;
        queue[element.name] = element;
      }
    });
    // distances are too close so we need to check for each point
    if (unsure) {
      c.points.forEach((p) => {
        minDist = Number.MAX_VALUE;
        Object.keys(queue).forEach((elementName) => {
          const poi = queue[elementName];
          const dist = getDistance(poi, p);
          if (dist < minDist) {
            minDist = dist;
            closest = poi;
          }
        });
        switch (p.event_type) {
          case 'imp':
            dictPOI[closest.name].impressions += 1;
            break;
          case 'click':
            dictPOI[closest.name].clicks += 1;
            break;
          default:
            console.error(`wrong event_type ${p.event_type} found within data`);
            break;
        }
      });
    } else {
      dictPOI[closest.name].impressions += c.impressions;
      dictPOI[closest.name].clicks += c.clicks;
    }
  });

  return dictPOI;
}

/**
 * Groups points into clusters
 * @param {point[]} rawData the list of points
 * @param {Number} clusterDiameter
 * @returns {Object} a dictionary containing all clusters
 */
function clusterize(rawData, clusterDiameter) {
  const clusters = {};
  var cpt = 0;
  rawData.forEach((row) => {
    console.log(`${Math.round((cpt * 100) / rawData.length)}% --- ${cpt += 1}/${rawData.length}`);
    const nbClusters = Object.keys(clusters).length;
    let foundCluster = false;
    let i = 0;
    // going through clusters
    while (!foundCluster && i < nbClusters) {
      const dist = getDistance(row, clusters[i]);
      if (dist < clusterDiameter) {
        const newCenter = getCenterOfBounds([...clusters[i].points, row]);
        clusters[i].lat = newCenter.latitude;
        clusters[i].lon = newCenter.longitude;
        clusters[i].points.push(row);
        clusters[i].impressions += row.event_type === 'imp' ? 1 : 0;
        clusters[i].clicks += row.event_type === 'click' ? 1 : 0;
        foundCluster = true;
      }
      i += 1;
    }
    // Create a new cluster
    if (!foundCluster) {
      clusters[nbClusters] = {
        lat: row.lat,
        lon: row.lon,
        points: [row],
        impressions: row.event_type === 'imp' ? 1 : 0,
        clicks: row.event_type === 'click' ? 1 : 0,
      };
    }
  });
  return clusters;
}

export {
  linkEventsToPOI,
  linkEventsToPOI2,
  clusterize,
};
