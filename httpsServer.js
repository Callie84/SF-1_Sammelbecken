const fs = require('fs');
const https = require('https');
const app = require('./server'); // assumes server exports an Express app
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};
https.createServer(options, app).listen(process.env.PORT || 3001, () => {
  console.log('HTTPS Server läuft auf Port', process.env.PORT || 3001);
});