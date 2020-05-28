const express = require('express');
var mysql			= require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'pets'
});

connection.connect();

const app = express();
const port = 5000;

app.get('/', (req, res) => {

	var data;
	connection.query('SELECT * FROM cats', (err, rows) => {
		if (err) throw err;

		res.send(rows);
	})
});

app.listen(port, () => console.log(`listening... {port}`));