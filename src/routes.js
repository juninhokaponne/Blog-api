const express = require('express');
const routes = express.Router();

const AuthenticateController = require('./controllers/AuthenticateController');
const BlogController = require('./controllers/BlogController');
const UserController = require('./controllers/UserController');
const Auth = require('./middlewares/Auth');

// Login
routes.post('/login', AuthenticateController.login)

// Create user on database
routes.post('/users', UserController.createUser)

// List users
routes.get('/users',Auth.eAdmin, UserController.listUsers)

// List user by ID
routes.get('/users/:id',Auth.eAdmin, UserController.ListUsersId)

//Delete me 
routes.delete('/users/me/:id',Auth.eAdmin, UserController.deleteMe)

// Create post
routes.post('/posts',Auth.eAdmin, BlogController.createPost)

// List posts
routes.get('/posts',Auth.eAdmin, BlogController.listPosts)

// List post by ID
routes.get('/posts/:id',Auth.eAdmin, BlogController.listPostById)

// Update post
routes.put('/posts/:id',Auth.eAdmin, BlogController.updatePost)

// Get Post by description 
routes.get('/list_all_posts/',Auth.eAdmin, BlogController.listAllPost)

// Delete Post 
routes.delete('/posts/:id',Auth.eAdmin,BlogController.deletePost)


module.exports = routes;