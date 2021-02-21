const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('@fast-csv/parse');
const { linkEventsToPOI } = require('./src/utils');

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

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.post('/pois', async (req, res) => {
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

module.exports = server;
