//installation express
const express = require('express');
const app = express();

//To parse incoming JSON requests and put the parsed data in req.body.
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//installation .env
require('dotenv').config();

//Bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//installation helmet
const helmet = require('helmet');
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//Gestion du CORS pour que nos deux serveurs puissent communiquer entre eux
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

//Gestion des images
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

//Lien vers les routes pour les posts
const postRoutes = require('./routes/post');
app.use('/api/posts', postRoutes);

//Lien vers les routes pour les utilisateurs
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);

//Installation Sequelize et connection MySQL
const db = require('./models/index.js');
db.sequelize
  .authenticate()
  .then(() => console.log('Connected to the database !'))
  .catch((err) => console.log(err));
db.sequelize.sync(/*{ force: true }).then(() => {
  console.log('Drop and re-sync db.');
}*/);

module.exports = app;
