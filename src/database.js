const { connection } = require('mongoose');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydatabase','root','', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});



sequelize.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(() => {
    console.log("Erro: Conexão com o banco de dados não realizada com sucesso!");
});

module.exports = sequelize;