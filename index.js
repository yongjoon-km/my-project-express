const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const jobs = require('./routes/jobs');
const user = require('./routes/user')

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/jobs', jobs);
app.use('/user', user);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => console.log(`listening... ${port}`));