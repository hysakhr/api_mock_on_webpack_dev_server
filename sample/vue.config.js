const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const encoding = require('encoding-japanese');
const csvParse = require('csv-parse/lib/sync');


module.exports = {
  devServer: {
    port: 8080,
    hot: true,
    before: function(app, server, compiler) {
      function sendResponse(req, res, status = 200, body = {}, header = {}) {
        const defaultHeader = {
          'Content-Type': 'application/json',
          'charset': 'utf-8',
        };

        const responseHeader = Object.assign(defaultHeader, header);
        
        res.writeHead(status, responseHeader).end(JSON.stringify(body));
      }


      app.get('/api', function(req, res) {
        sendResponse(req, res, 200, {aaa: 'bbb', ccc: 111});
      });

      app.post('/api/csv_upload', upload.single('file'), function(req, res) {
        const file = req.file;
        const filePath = 'uploads/' + file.filename;
        const buf = fs.readFileSync(filePath);
        const detected = encoding.detect(buf);
        const encoded = encoding.convert(buf, { from: detected, to: 'UNICODE', type: 'string'});

        fs.unlinkSync(filePath);
        sendResponse(req, res, 200, csvParse(encoded));
      });
    }
  },
}