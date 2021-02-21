/**
 * @typedef {"imp"} IMPRESSIONS
 */
/**
 * @typedef {"click"} CLICK
 */
/**
 * @typedef {Object} point
 * @property {Number} lat the latitidue of the point
 * @property {Number} lon the longitude of the point
 * @property {IMPRESSIONS|CLICK} event_type
 */
/**
 * @typedef {Object} cluster
 * @property {Number} lat the latitidue of the point
 * @property {Number} lon the longitude of the point
 * @property {Number} impressions the number of impressions associated to this cluster
 * @property {Number} clicks the number of clicks associated to this cluster
 * @property {point[]} points points associated to this cluster
 */

/**
  * @typedef {Object} point_of_interest
  * @property {Number} lat the latitude of this poi
  * @property {Number} lon the longitude of this poi
  * @property {String} name
  */
