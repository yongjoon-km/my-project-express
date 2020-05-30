const express = require('express');
var cors 			= require('cors');
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

app.use(cors());

app.get('/', (req, res) => {

	res.send('hello world');
});

// get all jobs from database
app.get('/api/jobs', (req, res) => {
	connection.query('SELECT * FROM jobs ORDER BY job_id', (err, rows) => {
		if (err) throw err;

		res.send(rows);
	})
});

// insert a new job into database
app.post('/api/jobs/', (req, res) => {
	const job_name = req.param('job');
	connection.query(`INSERT INTO jobs(job_name) VALUES ('${job_name}')`, (err, rows) => {
		if (err) throw err;
		res.send({
			message: 'ok',
			job: job_name,
		});
	})
})

app.listen(port, () => console.log(`listening... ${port}`));