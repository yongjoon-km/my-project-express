const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models').User;

require('dotenv').config()
const router = express.Router()

router.get('/', async (req, res) => {
  console.log(req.user);
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  })
  res.send(users);
})

// add
router.post('/', async (req, res) => {
  const username = req.body.user;
  const password = req.body.password;
  const email = req.body.email;

  if (username && password && email) {

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await User.create({
        name: username,
        email: email,
        password: hashedPassword
      });
      res.send('user added');
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError')
        res.status(400).send('user already exist');
    }
  } else {
    res.status(404).send('bad request');
  }
})

// delete
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const count = await User.destroy({ where: { id: id } });
    res.send({
      message: 'delete success',
      affectedRows: count
    });
  } catch (err) {
    res.status(400).send('delete error');
  }
})

// update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    let result = await User.findOne({ where: { id: id } });
    if (!result) return res.status(404).send('user not found');

    let user = result.dataValues;
    const updatedUserData = {
      ...result.dataValues,
      name: username ? username : user.name,
      email: email ? email : user.email,
      password: password ? await bcrypt.hash(password, 10) : user.password
    }
    await User.update(updatedUserData, { where: { id: id } });
    return res.send(`update user ${id} success`);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(401).send('duplicated entry');
    else {
      console.log(err.name);
      return res.status(404).send(err);
    }
  }
})

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD, { expiresIn: '15m' })
        res.json({
          message: 'login success',
          token
        });
      } else {
        res.status(403).send('password incorrect');
      }
    } catch (err) {
      res.status(404).send('user not found');
    }
  } else {
    res.status(400).send('bad request');
  }
})


module.exports = router;