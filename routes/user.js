const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'project_db'
});

connection.connect();

router.get('/', (req, res) => {
  connection.query(`SELECT name FROM user`, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  })
})

router.post('/', async(req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  if (username === undefined || password === undefined) {
    res.status(404).send('bad request');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(`SELECT * FROM user WHERE name='${username}'`, (err, rows) => {
    if (err) throw err;
    if (rows.length > 0)
      res.status(400).send('user exist');
    else {
      connection.query(`INSERT INTO user (name, password) VALUES ('${username}', '${hashedPassword}')`, (err, rows) => {
        if (err) throw err;
        res.send({
          message: 'user added',
          password: hashedPassword
        });
      })
    }
  });
})

router.post('/login', async(req, res) => {
  const username = req.body.user;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query(`SELECT password FROM user WHERE name='${username}'`, async(err, rows) => {
    if (err) throw err;
    if (rows.length > 0) {
      if (await bcrypt.compare(password, rows[0].password)) {
        const token = jwt.sign({
          id: username,
        }, 'password', {
          expiresIn: '15m',
          issuer: 'yongkim',
        });
        res.json({
          code: 200,
          message: 'login success',
          token,
        })
      }
      else
        res.status(403).send('password incorrect')
    } else {
      res.status(404).send({ message: 'user not found' });
    }
  })
})


module.exports = router;