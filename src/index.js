const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const app = express();
require('dotenv').config();

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));
app.use('/chime', routes);

// start the server
app.listen(process.env.PORT_BACK, () => {
    console.log('listening on port ', process.env.PORT_BACK);
});
