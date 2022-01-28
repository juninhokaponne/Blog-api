const { response } = require("express");
const Posts = require("../models/Posts");
const User = require("../models/Users");
const Isemail = require("isemail");
const Sequelize = require("sequelize");
const QueryTypes = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = {
  async createUser(req, res) {
    const { displayname, email } = req.body;
    const password = await bcrypt.hash("123456", 8);

    if (await bcrypt.compare(req.body.password, password)) {
      return res.status(400).json({
        message: "User or password is wrong!",
      });
    }

    if (!email) {
      return res.status(400).json({ message: `"\email\" is required!` });
    }
    if (!password) {
      return res.status(400).json({ message: `"\Password\" is required!` });
    }

    Isemail.validate("test@iana.org", { errorLevel: true });

    if (!Isemail.validate(email)) {
      return res
        .status(400)
        .json({ message: `"\email\" must be a valid email ` });
    }

    if (displayname.length <= 7) {
      return res.status(400).json({
        message: `"\displayName\" length must be at least 8 characters long`,
      });
    }

    if (password.length <= 5) {
      return res.status(400).json({
        message: `"\password\" length must be 6 characters long`,
      });
    }

    const sequelize = new Sequelize("mydatabase", "root", "", {
      host: "localhost",
      dialect: "mysql",

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    User.sequelize
      .query(`SELECT email FROM users where email = ? `, {
        replacements: [email],
        type: QueryTypes.SELECT,
      })
      .then((results) => {
        if (results[0][0] == null) {
          return;
        }

        if (results[0][0].email === email) {
          return res.status(400).json({ message: "Usuário já existe" });
        }
      });

    await User.create(req.body)
      .then(() => {
        return res.status(201).json({ message: "Usuário criado !" });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Houve um problema ao cadastrar, tente novamente!",
        });
      });
  },

  async listUsers(req, res) {
    const users = await User.findAll({
      attributes: ["id", "displayname", "email", "image"],
    });
    return res.status(200).json(users, null, 10);
  },

  async ListId(req, res) {
    // id passado por params
    const { id } = req.params;

    const userslist = await User.findByPk(id, {
      attributes: ["id", "displayname", "email", "image"],
    });

    return res.status(200).json(userslist);
  },

  async createPost(req, res) {
    const { userId } = req;
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: `"\Title\" and "\content\" is required.` });
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
      return res.status(401).json({ message: 'Post não existe'})
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
    
    const sequelize = new Sequelize("mydatabase", "root", "", {
      host: "localhost",
      dialect: "mysql",

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });



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

  async deleteMe(req, res) {
    const { id } = req.params;
    const { userId } = req;

    if (id == userId) {
      await User.destroy({
        where: {
          id,
        },
      });
      res.status(200).json();
    } else {
      res.status(400).json();
    }
  },
};