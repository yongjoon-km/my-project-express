const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const sequelize = require('./models').sequelize;
const passportConfig = require('./passport');

const user = require('./routes/user');
const jobs = require('./routes/jobs');
const authRouter = require('./routes/auth');

const { isLoggedIn } = require('./routes/middlewares');

const app = express();
const port = 5000;

sequelize.sync();
passportConfig(passport);

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: false,
        _expires: 3000,
    },
}));

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/jobs', jobs);
app.use('/user', isLoggedIn, user);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => console.log(`listening... ${port}`));