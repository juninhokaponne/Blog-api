const { Sequelize, DataTypes } = require('sequelize');
const database = require('../database');
const Users = require('./Users');

const Posts = database.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

Posts.belongsTo(Users, {
    constraint: true,
    foreignKey: 'userId'
})


module.exports = Posts;