const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./database/sequelize.connection.js');

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', require('./routing/router.js'));

async function startApplication() {
    try {
        // await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection to database has been established successfully.');
        app.listen(port, () => console.log(`Express Server Listening on Port ${port}!`));
      } catch (error) {
        console.error('Unable to sync with the database:', error);
      }
}

startApplication();
