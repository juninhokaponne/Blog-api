const { Router } = require('express');
const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const AuthenticateController = require('./controllers/AuthenticateController');


// Create user on database
routes.post('/users',UserController.createUser)

// Login
routes.post('/login',AuthenticateController.login)

// List users
routes.get('/users',UserController.listUsers)

// List user by ID
routes.get('/users/:id',UserController.ListId)

// Create post
routes.post('/posts',UserController.createPost)

//Delete me 
routes.delete('/users/me', UserController.deleteMe)

module.exports = routes;