export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ako-poi-api',
      version: '1.0.0',
      description:
          'Goal is to have a REST API to link clicks and printed ads to points of interest',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      {
        url: 'https://ako-poi-api.herokuapp.com',
        description: 'Production server',
      },
    ],
  },
  apis: ['./*.js'],
};

/**
 * @openapi
 * components:
 *   schemas:
 *     POI:
 *       type: object
 *       required:
 *         - lat
 *         - lon
 *         - name
 *       properties:
 *         lat:
 *           type: number
 *           example: 48.82094216189432
 *         lon:
 *           type: number
 *           example: 2.4049238868200975
 *         name:
 *           type: string
 *           example: "Arc de triomphe"
 *     ExtendedPOI:
 *       allOf:
 *         - $ref: "#/components/schemas/POI"
 *         - type: object
 *           properties:
 *             impressions:
 *               type: integer
 *               example: 19600
 *             clicks:
 *               type: integer
 *               example: 2300
 *
 */
