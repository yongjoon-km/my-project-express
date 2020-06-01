const express = require('express');
var cors 			= require('cors');
var mysql			= require('mysql');
const bodyParser = require('body-parser');


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
app.use(bodyParser.json());

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

	const job_name = req.body['job_name'];

	if (job_name) {
		connection.query(`INSERT INTO jobs(job_name) VALUES ('${job_name}')`, (err, rows) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY')
					res.status(400).send({
						message: 'duplicated entry',
					})
					return;
			} else {
				res.send({
					message: 'ok',
					job: job_name,
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'wrong data format',
		});
	}	
})

app.delete('/api/jobs/', (req, res) => {
	const job_name = req.body['job_name'];

	if (job_name === undefined) {
		res.status(400).send({
			message: 'wrong data format',
		});
		return ;
	}

	connection.query(`DELETE FROM jobs WHERE job_name = '${job_name}'`, (err, rows) => {
		if (err) console.log(err);

		if (rows.affectedRows === 0) {
			res.status(404).send({
				message: 'data not found',
			})
		} else {
			res.send({
				message: 'deleted',
				job_name: job_name
			});
		}
	});
});

app.put('/api/jobs/', (req, res) => {

	const new_job_name = req.body['new_job_name'];
	const old_job_name = req.body['old_job_name']

	if (new_job_name === undefined || old_job_name === undefined) {
		res.status(400).send({
			message: 'wrong data format',
		});
		return ;
	}

	connection.query(`UPDATE jobs SET job_name='${new_job_name}' WHERE job_name='${old_job_name}'`, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			if (rows.affectedRows === 0) {
				res.status(404).send({
					message: 'data not found',
					old_job_name: old_job_name
				});
			} else {
				res.send({
					message: 'updated',
					new_job_name: new_job_name,
					old_job_name: old_job_name
				});
			}
		}
	});

})

app.listen(port, () => console.log(`listening... ${port}`));