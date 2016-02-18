/*Server for Spencer's website */

var express 		= require('express'); //Server
var bodyParser 		= require('body-parser'); //HTTP Request Parser
var methodOverride 	= require('method-override'); //HTTP Request Methods
var favicon 		= require('serve-favicon'); //Load Favicon
var morgan       	= require('morgan');

var app = express();

//Configuration
var port = process.env.port || 3000;


//Module connection
app.use(morgan('dev')); // log every request to the console

//HTML Request parsing
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
//app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));

// set the view engine to ejs
app.set('view engine', 'ejs');
// change views folder location
app.set('views', __dirname + '/public/views');

//Routing ============================================================

//Frontend Router------------------
var Frontrouter = express.Router();

Frontrouter.use(function(req, res, next){
	//Do logging
	console.log(req.method, req.url);
	next();
});

Frontrouter.get("/", function(req, res){
	res.render('pages/index');
});

app.use("/", Frontrouter);

//Start Server
app.listen(port);
console.log("Local server running at " + port);

exports = module.exports = app;
