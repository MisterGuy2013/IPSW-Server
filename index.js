var url = require('url');
var querystring = require('querystring');
var Unblocker = require('unblocker');
var Transform = require('stream').Transform;
var express = require('express')
var app = express();
function XFrameSameOrigin(data) {
  data.headers['x-frame-options'] = 'allow';
}
var unblocker = new Unblocker({
    prefix: '/proxy',
      responseMiddleware: [
    XFrameSameOrigin,
  ]
});

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
// ...
app.use(requireHTTPS);
app.use(unblocker);

app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;

app.get('index.html', function(req, res) {
    //...
});

app.listen(port, function() {
    console.log(`node IPSW SHSH Signing server started`);
}).on("upgrade", unblocker.onUpgrade); 
