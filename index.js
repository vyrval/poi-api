import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from '@fast-csv/parse';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import swaggerOptions from './swaggerOptions.js';
import { linkEventsToPOI } from './src/utils.js';

let port = process.env.PORT;
if (!port || port === '') {
  port = 8080;
}
let dataFile = process.env.DATAFILE;
if (!dataFile || dataFile === '') {
  dataFile = './data/events.csv';
}

const data = [];

const app = express();
app.use(express.json());

const server = app.listen(port, async () => {
  const swaggerSpec = await swaggerJsdoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  fs.createReadStream(path.resolve(dataFile))
    .pipe(csv.parse({ headers: true, delimiter: ',' }))
    .on('error', (error) => {
      console.error('parseDataFile', error);
    })
    .on('data', (row) => {
      data.push(row);
    });

  console.log(`Running on port ${port}`);
});

/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', (_, res) => {
  res.send('Hello World!');
});

/**
 * @openapi
 * /pois:
 *   get:
 *     summary: Links clicks and impressions to given points of interest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/POI"
 *     responses:
 *       200:
 *         description: Returns a dict of points of interest.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 $ref: "#/components/schemas/ExtendedPOI"
 */
app.get('/pois', async (req, res) => {
  try {
    const inputArray = req.body;
    if (Array.isArray(inputArray)) {
      res.send(linkEventsToPOI(data, inputArray));
    } else {
      console.error('app.post', 'input is not an array');
      res.status(400);
      res.send();
    }
  } catch (error) {
    console.error('app.post', error);
    res.status(500);
    res.send();
  }
});

export {
  server,
};
