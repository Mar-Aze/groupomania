/**Configuration de la base de données avec 
utilisation de dotenv pr ne pas commit les infos sensibles**/

require('dotenv').config();
module.exports = {
  development: {
    username: process.env.USER,
    password: process.env.MDP,
    database: process.env.DB,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
