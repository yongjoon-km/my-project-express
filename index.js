const express = require('express');
var mysql			= require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'project_db'
});

connection.connect();

const app = express();
const port = 5000;

app.get('/', (req, res) => {

	res.send('hello world');
});

app.get('/api/jobs', (req, res) => {
	connection.query('SELECT * FROM jobs ORDER BY job_id', (err, rows) => {
		if (err) throw err;

		res.send(rows);
	})
})

app.listen(port, () => console.log(`listening... {port}`));