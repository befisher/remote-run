/**
 * Created by fisher at 8:28 PM on 1/31/17.
 *
 * Run commands remotely via browser.
 */

'use strict';

let app = require('express')();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let exec = require('child_process').exec;

let port = 3000;
if (process.argv.length > 2) {
	port = +process.argv[2];
	if (1 > port || 65535 < port) {
		console.error('ERROR: unavailable port! Make sure http port is number and is limited to <0-65535>.');
		return;
	}
	if (1024 >= port) {
		console.warn('WARNING: Your port is not bigger than 1024, this might cause some problems!')
	}
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use((req, res, next) => {
	if (req.headers.origin) {
		res.set('Access-Control-Allow-Origin', req.headers.origin);
		// For angular cross domain request.
		res.set('Access-Control-Allow-Credentials', true);
		res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,*');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, x-token, *');
	}
	next();
});

app.route('/')
	.get((req, res) => {
		res.sendFile(`${__dirname}/index.html`);
	})
	.post((req, res) => {
		let body = req.body;
		if (!body.cmd) {return res.sendStatus(400)}
		exec(body.cmd.trim(), (err, stdout, stderr) => {
			// if (err) {return res.sendStatus(500);}
			res.jsonp({
				err: err,
				stdout: stdout,
				stderr: stderr
			});
		});
	});

app.listen(port);
console.log(`Server is running on port: ${port}`);
