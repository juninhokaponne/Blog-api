const { response } = require("express");
const Posts = require("../models/Posts");
const User = require("../models/Users");
const Isemail = require("isemail");
const jwt = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    const { displayname, email, password } = req.body;

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
        .json({ message: `"\email\" must be a valid email" ` });
    }

    if (displayname.length <= 7) {
      return res
        .status(400)
        .json({
          message: `"\displayName\" length must be at least 8 characters long`,
        });
    }

    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: `"\password\" length must be 6 characters long` });
    }

    await User.create(req.body)
      .then(() => {
        return res.status(201).json({ message: "Usuário criado com sucesso!" });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({
            message: "Houve um problema ao cadastrar, tente novamente!",
          });
      });
  },

  async listUsers(req, res) {
    const users = await User.findAll({
      attributes: ["id", "displayname", "email", "image"],
    });
    res.header("Access-Control-Expose-Headers", "x-access-token");
    return res.status(200).json(users, null, 10);
  },

  async ListId(req, res) {
    const { id } = req.params;

    const userslist = await User.findByPk(id, {
      attributes: ["id", "displayname", "email", "image"],
    });
    res.status(200).json(userslist);
  },

  async createPost(req, res) {
    await Posts.create(req.body)
      .then(() => {
        return res.status(201).json({ 
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId
         });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "Houve um problema ao tentar criar um post!" });
      });
  },

  async deleteMe(req, res) {
    const userslist = await User.delete(id, {
      attributes: ["id", "displayname", "email", "image"],
    });
    res.status(200).json(userslist);
  },
};
