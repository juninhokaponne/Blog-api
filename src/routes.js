const { Router } = require('express');
const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const AuthenticateController = require('./controllers/AuthenticateController');
const Auth = require('./middlewares/Auth');

// Create user on database
routes.post('/users', UserController.createUser)

// Login
routes.post('/login', AuthenticateController.login)

// List users
routes.get('/users',Auth.eAdmin, UserController.listUsers)

// List user by ID
routes.get('/users/:id',Auth.eAdmin, UserController.ListId)

// Create post
routes.post('/posts', UserController.createPost)

//Delete me 
routes.delete('/users/me/:id',Auth.eAdmin, UserController.deleteMe)

module.exports = routes;