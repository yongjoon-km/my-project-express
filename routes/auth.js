const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models').User;

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
	const { email, name, password } = req.body;
	try {
		const exUser = await User.findAll({ where: {email} });
		if (exUser.length > 0) {
			return res.status(400).send('already exist');
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			email,
			name,
			password: hashedPassword,
		});
		return res.send('create success');
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

router.post('/login', isNotLoggedIn, passport.authenticate('local'), (req, res) => {
	res.send('login success');
});

router.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('logout success');
})

module.exports = router;