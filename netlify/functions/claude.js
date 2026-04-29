
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  var EK = 'ISB9AAIVQwIRL19dWSgfHDMPcHFlWwsWCAcQK10RFQY7VDojCTgeUiENPjEFGk0OFT4mVgd+QVklOTUiWwBUJSQICCAeEQRWFQwvBA8FAF0TABxHIAhhe0cFJDEYLgEFWSgwX10XGwMXBi0g';
  var SL = 'RKPalancaFontestad2026Inmobiliaria';

  function dk() {
    var buf = Buffer.from(EK, 'base64');
    var k = '';
    for (var i = 0; i < buf.length; i++) {
      k += String.fromCharCode(buf[i] ^ SL.charCodeAt(i % SL.length));
    }
    return k;
  }

  try {
    var body = JSON.parse(event.body);

    var https = require('https');

    var postData = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: body.messages
    });

    var result = await new Promise(function(resolve, reject) {
      var options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': dk(),
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'pdfs-2024-09-25',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var req = https.request(options, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk; });
        res.on('end', function() { resolve({ status: res.statusCode, body: data }); });
      });

      req.on('error', function(e) { reject(e); });
      req.write(postData);
      req.end();
    });

    return {
      statusCode: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: result.body
    };

  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
