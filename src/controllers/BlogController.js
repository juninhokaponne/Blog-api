const { response } = require("express");
const Posts = require("../models/Posts");
const User = require("../models/Users");
const Sequelize = require("sequelize");
const QueryTypes = require("sequelize");

module.exports = {
    async createPost(req, res) {
        const { userId } = req;
        const { title, content } = req.body;
        
        if (!title || !content) {
          return res.status(400).json({
            message: `"\Title\" and "\content\" is required.` 
            });
        }
    
        await Posts.create({
          title,
          content,
          userId,
        })
          .then(() => {
            return res.status(201).json({
              title: title,
              content: content,
              userId: userId,
            });
          })
          .catch((err) => {
            return res.status(401).json({
              message: err,
            });
          });
    },

    async listPosts(req, res) {
        const myListPosts = await Posts.findAll({
          attributes: ['id','title','content','createdAt','updatedAt'], 
          include: [{
            model: User,
            required: true,
            attributes: ['id','displayname','email','image']
          }]
        })
    
        res.status(200).json(myListPosts)
    
    },

    async listPostById(req, res) {
        const { id } = req.params;
    
        const verifyPostExist = await Posts.findOne({
          attributes:['id'],
          where: {
            id: id 
          }
        })
    
        // Verify if exist post by id
        if(verifyPostExist == null || typeof verifyPostExist == null){
          return res.status(401).json({ message: 'Post does not exist'})
        }
        
        const listPostByid = await Posts.findOne({
          attributes: ['id','title','content','createdAt','updatedAt'],
          include: [{
            model: User,
            required: true,
            attributes: ['id','displayname','email','image']
          }],
          where: {
            id: req.params.id,
          },
        });
        res.status(200).json(listPostByid);
    },

    async updatePost(req,res){
        const { id } = req.params;
        const { title, content} = req.body;
    
        if (!title){
          return res.status(200).json({ message: `"\title\" is required!`});
        }
        
        if(!content){
          return res.status(200).json({ message: `"\content\" is required!`});
        }
    
        User.sequelize
          .query(`UPDATE posts SET title = ? , content = ? where id = ? `, {
            replacements: [title, content ,id],
            type: QueryTypes.SELECT,
          })
          .then((results) => {
            res.status(200).json({
              title,
              content,
              userId: id
            })
          });
    },

    async listAllPost(req,res){
        const { title } = req.query;

        const listPost = await Posts.findOne({
          attributes: ['title'],
          where: {
            title
          }
        })
        
        res.status(200).json(listPost);
    },

    async deletePost(req, res){
        const { userId } = req;
        const { postId } = req.body;
        const { id } = req.params;
    
        if (id == userId) {
          await Posts.destroy({
            where: {
              id: postId
            },
          });
          res.status(200).json();
        } else {
          res.status(400).json();
        }
    },
}