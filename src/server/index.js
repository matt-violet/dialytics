/* eslint-disable func-names */
// import { base_url } from '../../tokens';

const express = require('express');
const http = require('https');


const app = express();

const options = {
  method: 'GET',
  hostname: 'https://sandbox-api.dexcom.com',
  port: null,
  path: '/v2/users/self/egvs?startDate=2017-06-16T15:30:00&endDate=2017-06-16T15:45:00',
  headers: {
    authorization: 'Bearer {your_access_token}',
  }
};

const req = http.request(options, (res) => {
  const chunks = [];
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });
  res.on('end', () => {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

app.use(express.static('dist'));

app.get('https://sandbox-api.dexcom.com', (req, res) => {
  console.log('server');
  res.send();
});

req.end();

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}!`));
